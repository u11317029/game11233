// ═════════ 音效與背景音樂（全站共用） ═════════
// 音效全部用 Web Audio 即時合成（8-bit 可愛風），不需要音效檔。
//   Sfx.play('jump')            播放音效
//   Sfx.bgm.play(url)           播放背景音樂（無縫循環）；Sfx.bgm.duck(true) 調小聲
//   Sfx.toggle() / Sfx.muted    開關聲音（記在這台裝置）
//   Sfx.bindClicks()            頁面上所有按鈕點擊都有「嗶」一聲
window.Sfx = (() => {
  let ac = null, master = null, sfxGain = null, bgmGain = null, noiseBuf = null;
  let muted = false;
  try { muted = localStorage.getItem('zhuyin-sound') === 'off'; } catch (e) {}

  function ctx() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ac = new AC();
      master = ac.createGain(); master.gain.value = muted ? 0 : 1; master.connect(ac.destination);
      sfxGain = ac.createGain(); sfxGain.gain.value = 0.42; sfxGain.connect(master);
      bgmGain = ac.createGain(); bgmGain.gain.value = 0.32; bgmGain.connect(master);
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }
  // 瀏覽器規定：要使用者先點一下才能出聲
  const unlock = () => { ctx(); bgm._tryStart(); };
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev => addEventListener(ev, unlock, { capture: true, passive: true }));

  // 一個音：波形、起始/結束頻率、長度、音量、延遲
  function tone({ type = 'square', f = 440, f2 = null, dur = 0.12, vol = 0.5, at = 0, vib = 0 }) {
    const a = ctx(); if (!a) return;
    const t = a.currentTime + at;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
    if (vib) {
      const l = a.createOscillator(), lg = a.createGain();
      l.frequency.value = 18; lg.gain.value = vib; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + dur);
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(sfxGain);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function noise({ dur = 0.1, vol = 0.3, at = 0, freq = 1800, q = 1 }) {
    const a = ctx(); if (!a) return;
    const t = a.currentTime + at;
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = noiseBuf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(sfxGain);
    s.start(t); s.stop(t + dur + 0.02);
  }
  const notes = (list, type = 'square', step = 0.07, vol = 0.32) =>
    list.forEach((f, i) => tone({ type, f, dur: step * 1.6, vol, at: i * step }));

  let stepAlt = false;
  const SOUNDS = {
    click:      () => tone({ f: 880, f2: 1320, dur: 0.05, vol: 0.25 }),
    select:     () => notes([660, 990], 'square', 0.05, 0.25),
    pop:        () => { tone({ type: 'sine', f: 520, f2: 1400, dur: 0.09, vol: 0.45 }); noise({ dur: 0.05, vol: 0.12, freq: 4000 }); },
    step:       () => { stepAlt = !stepAlt; tone({ type: 'triangle', f: stepAlt ? 190 : 160, f2: 90, dur: 0.05, vol: 0.28 }); },
    jump:       () => tone({ f: 320, f2: 760, dur: 0.14, vol: 0.28 }),
    land:       () => noise({ dur: 0.06, vol: 0.12, freq: 600 }),
    gem:        () => notes([1319, 1976], 'square', 0.05, 0.22),
    coin:       () => notes([1047, 1319, 1568], 'square', 0.045, 0.22),
    stomp:      (n = 1) => { tone({ type: 'triangle', f: 700 * Math.pow(1.12, n - 1), f2: 220, dur: 0.16, vol: 0.5 }); noise({ dur: 0.06, vol: 0.18, freq: 1200 }); },
    hurt:       () => tone({ f: 520, f2: 140, dur: 0.32, vol: 0.32, vib: 40 }),
    bump:       () => { tone({ type: 'square', f: 180, f2: 120, dur: 0.08, vol: 0.32 }); noise({ dur: 0.05, vol: 0.15, freq: 900 }); },
    powerup:    () => notes([523, 659, 784, 1047, 1319, 1568], 'square', 0.06, 0.24),
    heart:      () => notes([784, 1175, 1568], 'triangle', 0.08, 0.4),
    magic:      () => { tone({ type: 'sine', f: 900, f2: 2400, dur: 0.16, vol: 0.32 }); tone({ type: 'square', f: 1800, f2: 3600, dur: 0.08, vol: 0.08, at: 0.03 }); },
    zap:        () => { tone({ type: 'square', f: 1200, f2: 300, dur: 0.12, vol: 0.25 }); noise({ dur: 0.1, vol: 0.2, freq: 2500 }); },
    spring:     () => tone({ type: 'sine', f: 180, f2: 900, dur: 0.3, vol: 0.5, vib: 60 }),
    checkpoint: () => notes([784, 988, 1175, 1568], 'triangle', 0.08, 0.42),
    slam:       () => { tone({ type: 'triangle', f: 120, f2: 40, dur: 0.25, vol: 0.6 }); noise({ dur: 0.2, vol: 0.3, freq: 300 }); },
    roar:       () => { tone({ type: 'sawtooth', f: 110, f2: 55, dur: 0.9, vol: 0.28, vib: 25 }); noise({ dur: 0.8, vol: 0.18, freq: 400, q: .7 }); },
    correct:    () => notes([1047, 1319, 1568, 2093], 'square', 0.07, 0.26),
    wrong:      () => { tone({ f: 330, f2: 300, dur: 0.14, vol: 0.25 }); tone({ f: 247, f2: 220, dur: 0.22, vol: 0.25, at: 0.14 }); },
    erase:      () => noise({ dur: 0.18, vol: 0.2, freq: 3000, q: .5 }),
    fanfare:    () => {
      const m = [[523, .1], [659, .1], [784, .1], [1047, .25], [784, .1], [1047, .45]];
      let t = 0; for (const [f, d] of m) { tone({ f, dur: d * 1.2, vol: 0.26, at: t }); tone({ type: 'triangle', f: f / 2, dur: d * 1.2, vol: 0.3, at: t }); t += d; }
    },
    start:      () => notes([392, 523, 659, 784], 'square', 0.08, 0.24),
  };
  function play(name, ...args) {
    if (muted || !SOUNDS[name]) return;
    try { SOUNDS[name](...args); } catch (e) {}
  }

  // ───────── 背景音樂：解碼後用 AudioBuffer 循環，並跳過開頭的靜音，接起來比較順 ─────────
  const bgm = {
    url: null, src: null, buffers: {}, wanted: false, ducked: false,
    async play(url) {
      this.url = url; this.wanted = true;
      this._tryStart();
    },
    stop() { this.wanted = false; if (this.src) { try { this.src.stop(); } catch (e) {} this.src = null; } },
    duck(on) {
      this.ducked = on;
      if (bgmGain && ac) bgmGain.gain.setTargetAtTime(on ? 0.08 : 0.32, ac.currentTime, 0.3);
    },
    async _tryStart() {
      if (!this.wanted || this.src || !this.url) return;
      const a = ctx(); if (!a || a.state !== 'running' && a.state !== 'suspended') return;
      try {
        let buf = this.buffers[this.url];
        if (!buf) {
          const res = await fetch(this.url);
          buf = await a.decodeAudioData(await res.arrayBuffer());
          this.buffers[this.url] = buf;
        }
        if (!this.wanted || this.src) return;
        const d = buf.getChannelData(0);
        let s = 0; while (s < d.length && Math.abs(d[s]) < 0.003) s++;
        let e = d.length - 1; while (e > s && Math.abs(d[e]) < 0.003) e--;
        const src = a.createBufferSource();
        src.buffer = buf; src.loop = true;
        src.loopStart = s / buf.sampleRate; src.loopEnd = (e + 1) / buf.sampleRate;
        src.connect(bgmGain); src.start(0, src.loopStart);
        this.src = src;
        if (this.ducked) this.duck(true);
      } catch (e) {
        // file:// 開啟時 fetch 可能被擋，改用 <audio>
        if (!this._audio) { this._audio = new Audio(this.url); this._audio.loop = true; this._audio.volume = 0.3; }
        if (!muted) this._audio.play().catch(() => {});
        this.src = { stop: () => this._audio.pause() };
      }
    },
  };

  function setMuted(m) {
    muted = m;
    try { localStorage.setItem('zhuyin-sound', m ? 'off' : 'on'); } catch (e) {}
    if (master && ac) master.gain.setTargetAtTime(m ? 0 : 1, ac.currentTime, 0.05);
    if (bgm._audio) { if (m) bgm._audio.pause(); else if (bgm.wanted) bgm._audio.play().catch(() => {}); }
    document.querySelectorAll('.sound-toggle').forEach(b => b.textContent = m ? '🔇' : '🔊');
  }

  // 所有按鈕、連結按鈕點下去「嗶」一聲
  function bindClicks(root = document) {
    root.addEventListener('pointerdown', e => {
      const el = e.target.closest('button, a.btn, a.tab, .lv, .opt, .item, summary');
      if (!el || el.disabled || el.classList.contains('sound-toggle') || el.dataset.noClick !== undefined) return;
      play('click');
    });
  }
  // 在導覽列放一個開關聲音的按鈕
  function addToggle(container, cls = '') {
    if (!container) return null;
    const b = document.createElement('button');
    b.className = 'sound-toggle ' + cls; b.type = 'button'; b.title = '開／關聲音';
    b.textContent = muted ? '🔇' : '🔊';
    b.addEventListener('click', () => setMuted(!muted));
    container.appendChild(b);
    return b;
  }

  // 測試用：每個音效都跑一次，回傳出錯的名稱
  function _selfTest() {
    const bad = [];
    for (const [k, fn] of Object.entries(SOUNDS)) { try { fn(1); } catch (e) { bad.push(k + ': ' + e.message); } }
    return { count: Object.keys(SOUNDS).length, bad, state: ac && ac.state };
  }

  return { play, bgm, bindClicks, addToggle, toggle: () => setMuted(!muted), get muted() { return muted; }, _selfTest };
})();
