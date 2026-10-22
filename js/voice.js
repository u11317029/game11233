// ═════════ 朗讀：老師錄音優先，沒有錄音就用最自然的語音合成 ═════════
//   Voice.speak(text)            念一段文字（有老師錄過這段就播錄音）
//   Voice.speakSymbol(s)         念注音符號＋例詞（s 是 ZHUYIN_INDEX 的資料）
//   Voice.record(key) / stop     錄老師的聲音（存在這台裝置的瀏覽器裡）
//   Voice.openSettings()         打開「聲音設定」：選語音、調速度、試聽
//
// 語音品質：Edge 的「曉臻（Natural）」等神經語音最像真人；Chrome 有「Google 國語（臺灣）」；
// 程式會自動挑分數最高的，也可以在設定裡自己換。
window.Voice = (() => {
  const PREF_KEY = 'zhuyin-voice-pref';
  let pref = { name: '', rate: 0.85 };
  try { Object.assign(pref, JSON.parse(localStorage.getItem(PREF_KEY) || '{}')); } catch (e) {}
  const savePref = () => { try { localStorage.setItem(PREF_KEY, JSON.stringify(pref)); } catch (e) {} };

  // ───────── 挑語音 ─────────
  function score(v) {
    const n = v.name, l = (v.lang || '').replace('_', '-');
    let s = 0;
    if (/zh-TW|zh-Hant|cmn-Hant-TW/i.test(l)) s += 50; else if (/^zh/i.test(l)) s += 10; else return -1;
    if (/Natural|Neural/i.test(n)) s += 100;          // Edge 神經語音（最像真人）
    if (/Online/i.test(n)) s += 40;
    if (/Google/i.test(n)) s += 45;
    if (/Premium|Enhanced|高品質|優化/i.test(n)) s += 35;
    if (/HsiaoChen|HsiaoYu|曉臻|曉雨|Yating|雅婷/i.test(n)) s += 15;
    if (/Meijia|Mei-Jia|美佳/i.test(n)) s += 8;
    if (/Grandma|Grandpa|Rocko|Shelley|Flo|Eddy|Reed|Sandy/i.test(n)) s -= 5;
    return s;
  }
  const voices = () => (window.speechSynthesis ? speechSynthesis.getVoices() : []).filter(v => score(v) >= 0).sort((a, b) => score(b) - score(a));
  function currentVoice() {
    const list = voices();
    return list.find(v => v.name === pref.name) || list[0] || null;
  }
  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => {};

  // ───────── 老師錄音（IndexedDB） ─────────
  let dbp = null;
  function db() {
    if (!dbp) dbp = new Promise((res, rej) => {
      if (!window.indexedDB) return rej(new Error('no idb'));
      const r = indexedDB.open('zhuyin-voice', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('clips');
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
    return dbp;
  }
  const idb = (mode, fn) => db().then(d => new Promise((res, rej) => {
    const tx = d.transaction('clips', mode), st = tx.objectStore('clips'), req = fn(st);
    tx.oncomplete = () => res(req && req.result); tx.onerror = () => rej(tx.error);
  }));
  let keysCache = null;
  async function keys() {
    if (!keysCache) { try { keysCache = new Set(await idb('readonly', s => s.getAllKeys())); } catch (e) { keysCache = new Set(); } }
    return keysCache;
  }
  const getClip = k => idb('readonly', s => s.get(k)).catch(() => null);
  async function saveClip(k, blob) { await idb('readwrite', s => s.put(blob, k)); (await keys()).add(k); }
  async function deleteClip(k) { await idb('readwrite', s => s.delete(k)); (await keys()).delete(k); }
  async function has(k) { return (await keys()).has(k); }

  // ───────── 播放 ─────────
  let audioEl = null, token = 0;
  function stop() { token++; try { speechSynthesis.cancel(); } catch (e) {} if (audioEl) { audioEl.pause(); audioEl = null; } }
  function tts(text, rate) {
    return new Promise(res => {
      try {
        const u = new SpeechSynthesisUtterance(text);
        const v = currentVoice();
        u.lang = v ? v.lang : 'zh-TW'; if (v) u.voice = v;
        u.rate = rate || pref.rate; u.pitch = 1.05;
        u.onend = u.onerror = () => res();
        speechSynthesis.speak(u);
        setTimeout(res, 6000);
      } catch (e) { res(); }
    });
  }
  async function playClip(k) {
    const blob = await getClip(k);
    if (!blob) return false;
    return new Promise(res => {
      audioEl = new Audio(URL.createObjectURL(blob));
      audioEl.onended = audioEl.onerror = () => res(true);
      audioEl.play().catch(() => res(true));
    });
  }
  // 一段一段念：每段先找老師錄音（key），沒有就用語音合成（text）
  async function sequence(parts, rate) {
    stop();
    const my = token;
    for (const { key, text } of parts) {
      if (my !== token) return;
      if (key && await has(key) && await playClip(key)) continue;
      if (my !== token) return;
      if (text) await tts(text, rate);
    }
  }
  const speak = (text, rate) => sequence([{ key: 'text:' + text, text }], rate);
  const symKey = ch => 'sym:' + ch;
  function speakSymbol(s, { word = true, rate } = {}) {
    if (!s) return;
    const parts = [{ key: symKey(s.ch), text: s.say || '' }];
    if (word) parts.push({ key: 'text:' + s.word, text: s.word });
    if (!s.say && !word) parts[0].text = s.word;      // ㄝ、ㄟ、ㄥ 語音念不準：沒錄音時改念例詞
    return sequence(parts, rate);
  }

  // ───────── 錄音 ─────────
  let rec = null;
  async function record(key) {
    if (rec) await stopRecording();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream), chunks = [];
    mr.ondataavailable = e => e.data.size && chunks.push(e.data);
    const done = new Promise(res => mr.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' });
      if (blob.size > 800) await saveClip(key, blob);
      rec = null; res(blob);
    });
    mr.start();
    rec = { mr, done, key };
    setTimeout(() => rec && rec.mr === mr && mr.state === 'recording' && mr.stop(), 8000);   // 最長 8 秒
    return rec;
  }
  async function stopRecording() { if (!rec) return null; const r = rec; if (r.mr.state === 'recording') r.mr.stop(); return r.done; }

  // ───────── 聲音設定視窗 ─────────
  function openSettings() {
    let box = document.getElementById('voiceSettings');
    if (!box) {
      box = document.createElement('div');
      box.id = 'voiceSettings';
      box.style.cssText = 'position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:rgba(40,30,20,.45)';
      box.innerHTML = `<div class="card" style="background:#fffaeb;padding:20px 24px;max-width:min(520px,92vw);width:100%">
        <h2 style="margin:0 0 6px">🗣️ 聲音設定</h2>
        <p style="margin:0 0 10px;color:var(--muted,#7a6450);font-size:15px">挑一個最像真人的聲音。標 ⭐ 的是自然語音；用 <b>Microsoft Edge</b> 開啟可以選「曉臻（自然）」，最接近真人。</p>
        <label style="display:block;margin-bottom:8px">語音：<select id="vsVoice" style="font:inherit;max-width:100%"></select></label>
        <label style="display:block;margin-bottom:12px">速度：<input id="vsRate" type="range" min="0.6" max="1.2" step="0.05"> <span id="vsRateV"></span></label>
        <p style="margin:0 0 12px;font-size:14px">🎙️ 想要最真實的聲音？到「教材展示」用「老師錄音」錄下自己的聲音，整個網站都會優先播放。</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" id="vsTry">🔊 試聽</button><button class="btn primary" id="vsClose">完成</button></div></div>`;
      document.body.appendChild(box);
      box.addEventListener('click', e => { if (e.target === box) box.remove(); });
      box.querySelector('#vsClose').addEventListener('click', () => box.remove());
      box.querySelector('#vsTry').addEventListener('click', () => speak('小朋友好！我們一起來學注音，ㄅㄆㄇㄈ。'));
      box.querySelector('#vsVoice').addEventListener('change', e => { pref.name = e.target.value; savePref(); speak('你好，我是小簡。'); });
      const rate = box.querySelector('#vsRate');
      rate.addEventListener('input', () => { pref.rate = +rate.value; box.querySelector('#vsRateV').textContent = rate.value + ' 倍'; savePref(); });
    }
    const fill = () => {
      const list = voices(), cur = currentVoice();
      box.querySelector('#vsVoice').innerHTML = list.length ? list.map(v =>
        `<option value="${v.name}" ${cur && v.name === cur.name ? 'selected' : ''}>${score(v) >= 140 ? '⭐ ' : ''}${v.name}（${v.lang}）</option>`).join('')
        : '<option>這個瀏覽器沒有中文語音</option>';
    };
    fill(); setTimeout(fill, 400);
    box.querySelector('#vsRate').value = pref.rate; box.querySelector('#vsRateV').textContent = pref.rate + ' 倍';
  }

  return { speak, speakSymbol, sequence, stop, record, stopRecording, has, deleteClip, symKey, textKey: t => 'text:' + t,
           openSettings, currentVoice, voices, get recording() { return rec && rec.key; } };
})();

// 讓舊的 AirWriter.speak 也走這裡（有錄音就播錄音、用最好的語音）
if (window.AirWriter) window.AirWriter.speak = (text, rate) => window.Voice.speak(text, rate);

// 導覽列自動加上「🗣️ 聲音設定」按鈕
addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  if (!nav || nav.querySelector('.voice-btn')) return;
  const b = document.createElement('button');
  b.className = 'sound-toggle voice-btn'; b.type = 'button'; b.title = '聲音設定（換語音、調速度）'; b.textContent = '🗣️';
  b.addEventListener('click', () => window.Voice.openSettings());
  nav.appendChild(b);
});
