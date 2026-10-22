// ═════════ 空中寫字共用模組：注音辨識 + 手勢偵測 + 寫字板 ═════════
// 遊戲（game.html）、教材展示（materials.html）都用這一份。
//
//   AirWriter.Recognizer.check(strokes, aspect, target) → { ok, best, ranking, reason }
//   AirWriter.preload()                                  → 先在背景下載手勢模型
//   new AirWriter.Pad({ pad, canvas, video, status, onSubmit, onClear })
//       .start({ camera: true })  .stop()  .clear()  .strokes
window.AirWriter = (() => {
  const ZHUYIN = 'ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄧㄨㄩㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦ';

  // ───────── 辨識器：把筆跡和字型渲染的注音比對（雙向 chamfer 距離） ─────────
  const N = 64, PAD_PX = 8;
  const PASS_RANK = 3;      // 目標注音在 37 個符號中排前 3 名（小朋友空中寫字比較抖）
  const PASS_SCORE = 4.2;   // 且形狀距離夠小；實測寫對約 0.3~2.1，寫錯通常 5 以上
  const FONT = '400 170px "PingFang TC","Heiti TC","Noto Sans TC","Microsoft JhengHei",sans-serif';
  let templates = null;

  function distanceTransform(bin) {
    const INF = 1e9, d = new Float32Array(N * N);
    for (let i = 0; i < N * N; i++) d[i] = bin[i] ? 0 : INF;
    const D1 = 1, D2 = Math.SQRT2;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const i = y * N + x; let v = d[i];
      if (x > 0) v = Math.min(v, d[i - 1] + D1);
      if (y > 0) { v = Math.min(v, d[i - N] + D1); if (x > 0) v = Math.min(v, d[i - N - 1] + D2); if (x < N - 1) v = Math.min(v, d[i - N + 1] + D2); }
      d[i] = v;
    }
    for (let y = N - 1; y >= 0; y--) for (let x = N - 1; x >= 0; x--) {
      const i = y * N + x; let v = d[i];
      if (x < N - 1) v = Math.min(v, d[i + 1] + D1);
      if (y < N - 1) { v = Math.min(v, d[i + N] + D1); if (x < N - 1) v = Math.min(v, d[i + N + 1] + D2); if (x > 0) v = Math.min(v, d[i + N - 1] + D2); }
      d[i] = v;
    }
    return d;
  }
  function toShape(c) {
    const data = c.getContext('2d').getImageData(0, 0, N, N).data;
    const bin = new Uint8Array(N * N), pts = [];
    for (let i = 0; i < N * N; i++) if (data[i * 4 + 3] > 100) { bin[i] = 1; pts.push(i); }
    return { bin, pts, dt: distanceTransform(bin) };
  }
  // 把任意來源（bbox 範圍）等比例縮放置中到 N×N
  function fitBox(minX, minY, w, h) {
    const s = (N - PAD_PX * 2) / Math.max(w, h, 1e-6);
    return { s, ox: N / 2 - (minX + w / 2) * s, oy: N / 2 - (minY + h / 2) * s };
  }
  function glyphShape(ch, font = FONT) {
    const S = 220, big = document.createElement('canvas');
    big.width = big.height = S;
    const g = big.getContext('2d', { willReadFrequently: true });
    g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#000';
    g.fillText(ch, S / 2, S / 2);
    const data = g.getImageData(0, 0, S, S).data;
    let x0 = S, y0 = S, x1 = 0, y1 = 0;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (data[(y * S + x) * 4 + 3] > 128) {
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    const c = document.createElement('canvas'); c.width = c.height = N;
    const f = fitBox(x0, y0, x1 - x0 + 1, y1 - y0 + 1);
    c.getContext('2d').drawImage(big, x0, y0, x1 - x0 + 1, y1 - y0 + 1, x0 * f.s + f.ox, y0 * f.s + f.oy, (x1 - x0 + 1) * f.s, (y1 - y0 + 1) * f.s);
    return toShape(c);
  }
  function buildTemplates(font = FONT) {
    templates = [...ZHUYIN].map(ch => ({ ch, ...glyphShape(ch, font) }));
  }
  function strokesShape(list, aspect) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const s of list) for (const p of s) { const x = p.x * aspect; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
    if (!isFinite(x0) || Math.max(x1 - x0, y1 - y0) < 0.06) return null;     // 太小
    const c = document.createElement('canvas'); c.width = c.height = N;
    const g = c.getContext('2d');
    const f = fitBox(x0, y0, x1 - x0, y1 - y0);
    g.lineWidth = 4.5; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#000';
    for (const s of list) {
      g.beginPath();
      s.forEach((p, i) => { const X = p.x * aspect * f.s + f.ox, Y = p.y * f.s + f.oy; i ? g.lineTo(X, Y) : g.moveTo(X, Y); });
      if (s.length === 1) g.lineTo(s[0].x * aspect * f.s + f.ox + 0.1, s[0].y * f.s + f.oy);
      g.stroke();
    }
    return toShape(c);
  }
  function compare(a, b) {
    let s1 = 0, s2 = 0;
    for (const i of a.pts) s1 += b.dt[i];
    for (const i of b.pts) s2 += a.dt[i];
    return s1 / Math.max(1, a.pts.length) + s2 / Math.max(1, b.pts.length);
  }
  function rank(shape) {
    if (!templates) buildTemplates();
    return templates.map(t => ({ ch: t.ch, score: compare(shape, t) })).sort((a, b) => a.score - b.score);
  }
  // strokes：座標為 0~1 的比例；aspect：寫字板寬 / 高
  function check(strokes, aspect, target) {
    if (!strokes.length) return { ok: false, reason: 'empty' };
    const shape = strokesShape(strokes, aspect);
    if (!shape) return { ok: false, reason: 'small' };
    const ranking = rank(shape);
    const r = ranking.findIndex(x => x.ch === target);
    return { ok: r < PASS_RANK && ranking[r].score <= PASS_SCORE, best: ranking[0].ch, ranking, reason: 'shape' };
  }
  const Recognizer = { ZHUYIN, check, rank, glyphShape, strokesShape, buildTemplates, get ready() { return !!templates; } };

  // ───────── 手勢模型（約 8MB），整個網站共用一份 ─────────
  let loading = null, landmarker = null;
  function preload() {
    if (!loading) loading = (async () => {
      const V = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
      const { FilesetResolver, HandLandmarker } = await import(V + '/vision_bundle.mjs');
      const fileset = await FilesetResolver.forVisionTasks(V + '/wasm');
      const opts = d => ({ baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task', delegate: d },
                           runningMode: 'VIDEO', numHands: 1, minHandDetectionConfidence: 0.6, minTrackingConfidence: 0.5 });
      try { landmarker = await HandLandmarker.createFromOptions(fileset, opts('GPU')); }
      catch { landmarker = await HandLandmarker.createFromOptions(fileset, opts('CPU')); }
      return landmarker;
    })().catch(e => { loading = null; throw e; });
    if (!templates) setTimeout(() => templates || buildTemplates(), 300);
    return loading;
  }

  // ───────── 手勢判斷 ─────────
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const fingerUp = (lm, tip, pip) => dist(lm[tip], lm[0]) > dist(lm[pip], lm[0]) * 1.12;
  // ☝️ 只伸食指 = 寫字；✊ 握拳 = 暫停筆畫（移動不畫線）；✌️ 比 YA 停一下 = 擦掉；🖐️ 張開手掌停一下 = 送出
  function classify(lm) {
    const idx = fingerUp(lm, 8, 6), mid = fingerUp(lm, 12, 10), ring = fingerUp(lm, 16, 14), pinky = fingerUp(lm, 20, 18);
    const n = idx + mid + ring + pinky;
    if (idx && !mid && !ring && !pinky) return 'pen';
    if (idx && mid && !ring && !pinky) return 'peace';
    if (n >= 4) return 'open';
    if (n === 0) return 'fist';
    return 'none';
  }
  const MODE_LABEL = { pen: '✍️ 寫字中', fist: '⏸ 暫停筆畫', peace: '✌️ 擦掉…', open: '🖐️ 送出…', none: '⏸ 暫停筆畫' };

  // ───────── 寫字板 ─────────
  class Pad {
    constructor({ pad, canvas, video, status, onSubmit, onClear }) {
      Object.assign(this, { padEl: pad, cv: canvas, video, statusEl: status, onSubmit, onClear });
      this.cx = canvas.getContext('2d');
      this.strokes = []; this.cur = null; this.busy = false; this.running = false;
      this.colors = { glow: 'rgba(255,190,80,.35)', ink: '#fffaeb' };   // 筆跡顏色（亮底時改深色）
      this.stream = null; this.lastVideoTime = -1; this.raf = 0; this.lastT = 0;
      this.hand = { x: 0, y: 0, seen: false, mode: 'none', modeFrames: 0, hold: 0, holdKind: '' };
      this._bindPointer();
      addEventListener('resize', () => this.running && this.size());
    }
    status(t) { if (this.statusEl) this.statusEl.textContent = t; }
    size() {
      const r = this.padEl.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      this.cv.width = Math.max(1, Math.round(r.width * d)); this.cv.height = Math.max(1, Math.round(r.height * d));
    }
    get aspect() { return this.cv.width / this.cv.height; }
    clear() { this.strokes = []; this.cur = null; }
    endStroke() { if (this.cur && this.cur.length) this.strokes.push(this.cur); this.cur = null; }

    start({ camera = true } = {}) {
      this.running = true; this.size();
      this.lastT = performance.now();
      cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame(t => this._loop(t));
      if (camera) return this.startCamera();
      this.status('');
    }
    stop() {
      this.running = false;
      cancelAnimationFrame(this.raf);
      this.stopCamera();
    }
    get cameraOn() { return !!this.stream; }

    async startCamera() {
      this.status('正在開啟相機…');
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' }, audio: false });
        this.video.srcObject = this.stream; await this.video.play();
        this.video.style.display = '';
      } catch (e) {
        this.stream = null;
        this.status('沒有開啟相機，可以直接用滑鼠或手指在框裡寫字 ✍️');
        return false;
      }
      if (!landmarker) {
        this.status('正在載入手勢辨識…（第一次需要幾秒鐘）');
        try { await preload(); }
        catch (e) {
          console.warn(e);
          this.status('手勢辨識載入失敗（需要網路），可以用滑鼠或手指寫字 ✍️');
          return false;
        }
      }
      if (!this.running) { this.stopCamera(); return false; }
      this.status('把手舉到鏡頭前，伸出食指開始寫！');
      setTimeout(() => { if (this.statusEl && this.statusEl.textContent.startsWith('把手')) this.status(''); }, 4000);
      return true;
    }
    stopCamera() {
      if (this.stream) this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
      if (this.video) { this.video.srcObject = null; this.video.style.display = 'none'; }
      this.hand.seen = false;
    }

    _bindPointer() {
      // 滑鼠 / 觸控也能寫（沒有相機時的備案）
      const pos = e => { const r = this.cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; };
      this.cv.addEventListener('pointerdown', e => {
        if (this.busy) return;
        this.cv.setPointerCapture(e.pointerId);
        this.cur = [pos(e)];
      });
      this.cv.addEventListener('pointermove', e => { if (this.cur && !this.hand.seen) this.cur.push(pos(e)); });
      const up = () => { if (!this.hand.seen) this.endStroke(); };
      this.cv.addEventListener('pointerup', up); this.cv.addEventListener('pointercancel', up);
    }

    _onHand(lm, dt) {
      const h = this.hand;
      const tx = 1 - lm[8].x, ty = lm[8].y;          // 鏡像，像照鏡子一樣
      const k = h.seen ? 0.45 : 1;
      h.x += (tx - h.x) * k; h.y += (ty - h.y) * k;
      h.seen = true;
      const m = classify(lm);
      if (m === h.mode) h.modeFrames++; else { h.mode = m; h.modeFrames = 0; }
      const stable = h.modeFrames >= 2;

      if (h.mode === 'pen' && stable && !this.busy) {
        if (!this.cur) this.cur = [];
        const last = this.cur[this.cur.length - 1];
        if (!last || Math.hypot(last.x - h.x, last.y - h.y) > 0.004) this.cur.push({ x: h.x, y: h.y });
      } else this.endStroke();

      if ((h.mode === 'open' || h.mode === 'peace') && stable && !this.busy) {
        if (h.holdKind !== h.mode) { h.holdKind = h.mode; h.hold = 0; }
        h.hold += dt / 0.9;
        if (h.hold >= 1) {
          h.hold = 0; h.holdKind = '';
          if (h.mode === 'open') this.onSubmit && this.onSubmit();
          else { this.clear(); window.Sfx && Sfx.play('erase'); this.onClear && this.onClear(); }
          h.modeFrames = -30;    // 動作完成後短暫冷卻
        }
      } else { h.hold = 0; h.holdKind = ''; }
    }

    _loop(t) {
      if (!this.running) return;
      const dt = Math.min(0.1, (t - this.lastT) / 1000 || 0); this.lastT = t;
      const v = this.video;
      if (this.stream && landmarker && v.readyState >= 2 && v.currentTime !== this.lastVideoTime) {
        this.lastVideoTime = v.currentTime;
        try {
          const res = landmarker.detectForVideo(v, t);
          if (res.landmarks && res.landmarks.length) this._onHand(res.landmarks[0], dt);
          else { this.hand.seen = false; this.hand.hold = 0; if (this.cur) this.endStroke(); }
        } catch (e) { console.warn(e); }
      }
      this._render();
      this.raf = requestAnimationFrame(tt => this._loop(tt));
    }

    _render() {
      const { cx, cv, hand } = this;
      const W = cv.width, H = cv.height, u = W / 480;
      cx.clearRect(0, 0, W, H);
      cx.lineCap = 'round'; cx.lineJoin = 'round';
      const all = this.cur ? [...this.strokes, this.cur] : this.strokes;
      for (const pass of [[18 * u, this.colors.glow], [8 * u, this.colors.ink]]) {
        cx.lineWidth = pass[0]; cx.strokeStyle = pass[1];
        for (const s of all) {
          cx.beginPath();
          s.forEach((p, i) => i ? cx.lineTo(p.x * W, p.y * H) : cx.moveTo(p.x * W, p.y * H));
          if (s.length === 1) cx.lineTo(s[0].x * W + 0.1, s[0].y * H);
          cx.stroke();
        }
      }
      if (hand.seen) {
        const x = hand.x * W, y = hand.y * H;
        const col = { pen: '#ffcf3f', open: '#7ee081', peace: '#ff8fc8', fist: '#9fb3c8' }[hand.mode] || '#cfd8e3';
        const r = (hand.mode === 'pen' ? 9 : 13) * u;
        cx.fillStyle = col; cx.globalAlpha = .9;
        if (hand.mode === 'pen') { cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2); cx.fill(); cx.globalAlpha = 1; cx.lineWidth = 3 * u; cx.strokeStyle = '#3b2414'; cx.stroke(); }
        else {                                                // 暫停時游標是空心方框，看得出「筆抬起來了」
          cx.globalAlpha = 1; cx.lineWidth = 4 * u; cx.strokeStyle = col; cx.strokeRect(x - r, y - r, r * 2, r * 2);
          cx.lineWidth = 2 * u; cx.strokeStyle = '#3b2414'; cx.strokeRect(x - r - 3 * u, y - r - 3 * u, r * 2 + 6 * u, r * 2 + 6 * u);
        }
        // 左上角顯示目前的手勢
        const label = MODE_LABEL[hand.mode] || '';
        cx.font = `${18 * u}px "Cubic 11","PingFang TC",sans-serif`; cx.textBaseline = 'top';
        const tw = cx.measureText(label).width;
        cx.fillStyle = 'rgba(255,250,235,.92)'; cx.fillRect(8 * u, 8 * u, tw + 16 * u, 28 * u);
        cx.fillStyle = '#3b2414'; cx.fillText(label, 16 * u, 13 * u);
        if (hand.hold > 0) {           // 張手 / 握拳的倒數圈
          cx.beginPath(); cx.arc(x, y, 26 * u, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, hand.hold));
          cx.lineWidth = 6 * u; cx.strokeStyle = col; cx.stroke();
        }
      }
    }
  }

  // ───────── 朗讀（台灣華語語音） ─────────
  function speak(text, rate = 0.85) {
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-TW'; u.rate = rate;
      const v = speechSynthesis.getVoices().find(v => v.lang === 'zh-TW');
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  return { Recognizer, preload, Pad, speak };
})();
