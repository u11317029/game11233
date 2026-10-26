// ═════════ 注音課程資料：10 個單元、37 個符號 ═════════
// 教材展示、學習單共用。要增減例詞或調整單元，只改這個檔案。
//
// 每個符號：
//   ch      注音符號
//   word    例詞
//   reading 例詞每個字的注音（陣列，對應 word 的每個字）
//   at      這個符號出現在例詞的第幾個字（從 0 算）
//   emoji   圖片
//   say     念符號時給語音合成用的字（null = 語音念不準，只念例詞）
//   tip     發音提示
window.ZHUYIN_UNITS = [
  { id: 1, name: '雙唇與唇齒音', color: '#f08a3c', desc: '嘴唇一起動的聲音', symbols: [
    { ch: 'ㄅ', word: '爸爸', reading: ['ㄅㄚˋ', 'ㄅㄚ˙'], at: 0, emoji: '👨', say: '玻', tip: '嘴唇閉起來，再輕輕彈開。' },
    { ch: 'ㄆ', word: '葡萄', reading: ['ㄆㄨˊ', 'ㄊㄠˊ'], at: 0, emoji: '🍇', say: '坡', tip: '嘴唇閉起來，用力噴出一口氣。' },
    { ch: 'ㄇ', word: '媽媽', reading: ['ㄇㄚ', 'ㄇㄚ˙'], at: 0, emoji: '👩', say: '摸', tip: '嘴唇閉起來，聲音從鼻子跑出來。' },
    { ch: 'ㄈ', word: '飛機', reading: ['ㄈㄟ', 'ㄐㄧ'], at: 0, emoji: '✈️', say: '佛', tip: '上排牙齒輕咬下嘴唇，吹出氣。' },
  ] },
  { id: 2, name: '舌尖音', color: '#e8634a', desc: '舌尖頂住上牙齦', symbols: [
    { ch: 'ㄉ', word: '大象', reading: ['ㄉㄚˋ', 'ㄒㄧㄤˋ'], at: 0, emoji: '🐘', say: '得', tip: '舌尖頂住上牙齦，輕輕彈開。' },
    { ch: 'ㄊ', word: '兔子', reading: ['ㄊㄨˋ', 'ㄗ˙'], at: 0, emoji: '🐰', say: '特', tip: '舌尖頂住上牙齦，用力噴出氣。' },
    { ch: 'ㄋ', word: '牛奶', reading: ['ㄋㄧㄡˊ', 'ㄋㄞˇ'], at: 0, emoji: '🐮', say: '訥', tip: '舌尖頂住上牙齦，聲音從鼻子出來。' },
    { ch: 'ㄌ', word: '老虎', reading: ['ㄌㄠˇ', 'ㄏㄨˇ'], at: 0, emoji: '🐯', say: '勒', tip: '舌尖頂住上牙齦，聲音從舌頭兩邊出來。' },
  ] },
  { id: 3, name: '舌根音', color: '#c9a227', desc: '舌頭後面往上抬', symbols: [
    { ch: 'ㄍ', word: '狗狗', reading: ['ㄍㄡˇ', 'ㄍㄡ˙'], at: 0, emoji: '🐶', say: '哥', tip: '舌根頂住上顎，輕輕彈開。' },
    { ch: 'ㄎ', word: '恐龍', reading: ['ㄎㄨㄥˇ', 'ㄌㄨㄥˊ'], at: 0, emoji: '🦖', say: '科', tip: '舌根頂住上顎，用力噴出氣。' },
    { ch: 'ㄏ', word: '花朵', reading: ['ㄏㄨㄚ', 'ㄉㄨㄛˇ'], at: 0, emoji: '🌸', say: '喝', tip: '舌根靠近上顎，讓氣摩擦出來。' },
  ] },
  { id: 4, name: '舌面音', color: '#5aa836', desc: '舌面貼近上顎', symbols: [
    { ch: 'ㄐ', word: '雞蛋', reading: ['ㄐㄧ', 'ㄉㄢˋ'], at: 0, emoji: '🥚', say: '基', tip: '舌面貼住上顎，輕輕彈開。' },
    { ch: 'ㄑ', word: '企鵝', reading: ['ㄑㄧˋ', 'ㄜˊ'], at: 0, emoji: '🐧', say: '七', tip: '舌面貼住上顎，用力噴出氣。' },
    { ch: 'ㄒ', word: '西瓜', reading: ['ㄒㄧ', 'ㄍㄨㄚ'], at: 0, emoji: '🍉', say: '西', tip: '舌面靠近上顎，讓氣摩擦出來。' },
  ] },
  { id: 5, name: '翹舌音', color: '#2f9e8f', desc: '舌尖往上翹起來', symbols: [
    { ch: 'ㄓ', word: '蜘蛛', reading: ['ㄓ', 'ㄓㄨ'], at: 0, emoji: '🕷️', say: '知', tip: '舌尖翹起來頂住上顎，輕輕彈開。' },
    { ch: 'ㄔ', word: '車子', reading: ['ㄔㄜ', 'ㄗ˙'], at: 0, emoji: '🚗', say: '吃', tip: '舌尖翹起來，用力噴出氣。' },
    { ch: 'ㄕ', word: '獅子', reading: ['ㄕ', 'ㄗ˙'], at: 0, emoji: '🦁', say: '詩', tip: '舌尖翹起來靠近上顎，讓氣摩擦出來。' },
    { ch: 'ㄖ', word: '熱狗', reading: ['ㄖㄜˋ', 'ㄍㄡˇ'], at: 0, emoji: '🌭', say: '日', tip: '舌尖翹起來，喉嚨一起震動。' },
  ] },
  { id: 6, name: '平舌音', color: '#3d8fd1', desc: '舌尖平平的頂住牙齒', symbols: [
    { ch: 'ㄗ', word: '足球', reading: ['ㄗㄨˊ', 'ㄑㄧㄡˊ'], at: 0, emoji: '⚽', say: '資', tip: '舌尖平伸頂住上排牙齒背面，輕輕彈開。' },
    { ch: 'ㄘ', word: '草莓', reading: ['ㄘㄠˇ', 'ㄇㄟˊ'], at: 0, emoji: '🍓', say: '疵', tip: '舌尖頂住上排牙齒背面，用力噴出氣。' },
    { ch: 'ㄙ', word: '松鼠', reading: ['ㄙㄨㄥ', 'ㄕㄨˇ'], at: 0, emoji: '🐿️', say: '思', tip: '舌尖靠近上排牙齒背面，讓氣摩擦出來。' },
  ] },
  { id: 7, name: '介音', color: '#7b5cc4', desc: '可以放在中間的小幫手', symbols: [
    { ch: 'ㄧ', word: '衣服', reading: ['ㄧ', 'ㄈㄨˊ'], at: 0, emoji: '👕', say: '衣', tip: '嘴角往兩邊拉開，像在微笑。' },
    { ch: 'ㄨ', word: '烏龜', reading: ['ㄨ', 'ㄍㄨㄟ'], at: 0, emoji: '🐢', say: '烏', tip: '嘴唇圓圓的往前嘟。' },
    { ch: 'ㄩ', word: '金魚', reading: ['ㄐㄧㄣ', 'ㄩˊ'], at: 1, emoji: '🐟', say: '迂', tip: '嘴唇圓圓的，舌頭位置像念「ㄧ」。' },
  ] },
  { id: 8, name: '單韻母', color: '#d0558f', desc: '嘴型不變的韻母', symbols: [
    { ch: 'ㄚ', word: '鴨子', reading: ['ㄧㄚ', 'ㄗ˙'], at: 0, emoji: '🦆', say: '啊', tip: '嘴巴張得大大的。' },
    { ch: 'ㄛ', word: '菠蘿', reading: ['ㄅㄛ', 'ㄌㄨㄛˊ'], at: 0, emoji: '🍍', say: '喔', tip: '嘴巴圓圓的，不要嘟太前面。' },
    { ch: 'ㄜ', word: '天鵝', reading: ['ㄊㄧㄢ', 'ㄜˊ'], at: 1, emoji: '🦢', say: '鵝', tip: '嘴巴半開，嘴唇不要圓。' },
    { ch: 'ㄝ', word: '椰子', reading: ['ㄧㄝˊ', 'ㄗ˙'], at: 0, emoji: '🥥', say: null, tip: '嘴角稍微往兩邊拉，嘴巴半開。' },
  ] },
  { id: 9, name: '複韻母', color: '#b5651d', desc: '嘴型會滑動的韻母', symbols: [
    { ch: 'ㄞ', word: '愛心', reading: ['ㄞˋ', 'ㄒㄧㄣ'], at: 0, emoji: '❤️', say: '哀', tip: '從「ㄚ」滑到「ㄧ」。' },
    { ch: 'ㄟ', word: '杯子', reading: ['ㄅㄟ', 'ㄗ˙'], at: 0, emoji: '🥤', say: null, tip: '從「ㄝ」滑到「ㄧ」。' },
    { ch: 'ㄠ', word: '小貓', reading: ['ㄒㄧㄠˇ', 'ㄇㄠ'], at: 1, emoji: '🐱', say: '凹', tip: '從「ㄚ」滑到「ㄨ」。' },
    { ch: 'ㄡ', word: '猴子', reading: ['ㄏㄡˊ', 'ㄗ˙'], at: 0, emoji: '🐵', say: '歐', tip: '從「ㄛ」滑到「ㄨ」。' },
  ] },
  { id: 10, name: '聲隨韻母與捲舌韻母', color: '#4a6fa5', desc: '後面帶鼻音或捲舌', symbols: [
    { ch: 'ㄢ', word: '高山', reading: ['ㄍㄠ', 'ㄕㄢ'], at: 1, emoji: '⛰️', say: '安', tip: '先念「ㄚ」，最後舌尖頂住上牙齦，聲音從鼻子出來。' },
    { ch: 'ㄣ', word: '森林', reading: ['ㄙㄣ', 'ㄌㄧㄣˊ'], at: 0, emoji: '🌲', say: '恩', tip: '先念「ㄜ」，最後舌尖頂住上牙齦，聲音從鼻子出來。' },
    { ch: 'ㄤ', word: '糖果', reading: ['ㄊㄤˊ', 'ㄍㄨㄛˇ'], at: 0, emoji: '🍬', say: '骯', tip: '先念「ㄚ」，最後舌根往上抬，聲音從鼻子出來。' },
    { ch: 'ㄥ', word: '風箏', reading: ['ㄈㄥ', 'ㄓㄥ'], at: 0, emoji: '🪁', say: null, tip: '先念「ㄜ」，最後舌根往上抬，聲音從鼻子出來。' },
    { ch: 'ㄦ', word: '耳朵', reading: ['ㄦˇ', 'ㄉㄨㄛ˙'], at: 0, emoji: '👂', say: '兒', tip: '舌尖往上捲起來。' },
  ] },
];

// 方便查詢：ZHUYIN_INDEX['ㄅ'] → { ...symbol, unit }
window.ZHUYIN_INDEX = {};
for (const u of window.ZHUYIN_UNITS) for (const s of u.symbols) window.ZHUYIN_INDEX[s.ch] = { ...s, unit: u };

// 例詞加注音（直排在字的右邊，聲調在右側、輕聲點在上方）；hl = 要標色的字
window.zhuyinRuby = function (s, hl = s.at) {
  const zy = r => {
    const tone = r.match(/[ˊˇˋ]/), light = r.startsWith('˙') || r.endsWith('˙');
    const body = [...r.replace(/[ˊˇˋ˙]/g, '')].map(c => `<span>${c}</span>`).join('');
    return `<i class="zy">${light ? '<em class="light">˙</em>' : ''}${body}${tone ? `<em class="tone">${tone[0]}</em>` : ''}</i>`;
  };
  return [...s.word].map((c, i) => `<span class="ch ${i === hl ? 'hl' : ''}"><b>${c}</b>${zy(s.reading[i] || '')}</span>`).join('');
};

// ═════════ 聽音辨識：容易混淆的注音對 ═════════
// items：例詞（at = 要聽的那個字在詞裡的位置、zy = 那個字的注音、ans = 'a' 或 'b'）
window.ZHUYIN_PAIRS = [
  { id: 'en-eng', a: 'ㄣ', b: 'ㄥ', title: '前鼻音 ㄣ／後鼻音 ㄥ', color: '#4a6fa5',
    tipA: '舌尖頂住上牙齦，聲音短短的、在前面。', tipB: '舌頭後面往上抬，聲音在鼻子後面、比較長。',
    items: [
      { word: '開心', at: 1, zy: 'ㄒㄧㄣ', ans: 'a', emoji: '😊' }, { word: '金魚', at: 0, zy: 'ㄐㄧㄣ', ans: 'a', emoji: '🐟' },
      { word: '臉盆', at: 1, zy: 'ㄆㄣˊ', ans: 'a', emoji: '🪣' }, { word: '大門', at: 1, zy: 'ㄇㄣˊ', ans: 'a', emoji: '🚪' },
      { word: '星星', at: 0, zy: 'ㄒㄧㄥ', ans: 'b', emoji: '⭐' }, { word: '鯨魚', at: 0, zy: 'ㄐㄧㄥ', ans: 'b', emoji: '🐋' },
      { word: '朋友', at: 0, zy: 'ㄆㄥˊ', ans: 'b', emoji: '🧑‍🤝‍🧑' }, { word: '做夢', at: 1, zy: 'ㄇㄥˋ', ans: 'b', emoji: '💤' },
    ] },
  { id: 'an-ang', a: 'ㄢ', b: 'ㄤ', title: '前鼻音 ㄢ／後鼻音 ㄤ', color: '#2f9e8f',
    tipA: '先念「ㄚ」，最後舌尖頂住上牙齦。', tipB: '先念「ㄚ」，最後舌頭後面往上抬，聲音比較響亮。',
    items: [
      { word: '高山', at: 1, zy: 'ㄕㄢ', ans: 'a', emoji: '⛰️' }, { word: '帆船', at: 1, zy: 'ㄔㄨㄢˊ', ans: 'a', emoji: '⛵' },
      { word: '盤子', at: 0, zy: 'ㄆㄢˊ', ans: 'a', emoji: '🍽️' }, { word: '扇子', at: 0, zy: 'ㄕㄢˋ', ans: 'a', emoji: '🪭' },
      { word: '糖果', at: 0, zy: 'ㄊㄤˊ', ans: 'b', emoji: '🍬' }, { word: '起床', at: 1, zy: 'ㄔㄨㄤˊ', ans: 'b', emoji: '🛏️' },
      { word: '螃蟹', at: 0, zy: 'ㄆㄤˊ', ans: 'b', emoji: '🦀' }, { word: '綿羊', at: 1, zy: 'ㄧㄤˊ', ans: 'b', emoji: '🐑' },
    ] },
  { id: 'l-n', a: 'ㄌ', b: 'ㄋ', title: '邊音 ㄌ／鼻音 ㄋ', color: '#e8634a',
    tipA: '舌尖頂上牙齦，聲音從舌頭兩邊出來。', tipB: '舌尖頂上牙齦，聲音從鼻子出來（捏住鼻子就念不出來）。',
    items: [
      { word: '梨子', at: 0, zy: 'ㄌㄧˊ', ans: 'a', emoji: '🍐' }, { word: '籃球', at: 0, zy: 'ㄌㄢˊ', ans: 'a', emoji: '🏀' },
      { word: '小鹿', at: 1, zy: 'ㄌㄨˋ', ans: 'a', emoji: '🦌' }, { word: '老虎', at: 0, zy: 'ㄌㄠˇ', ans: 'a', emoji: '🐯' },
      { word: '泥土', at: 0, zy: 'ㄋㄧˊ', ans: 'b', emoji: '🟫' }, { word: '男生', at: 0, zy: 'ㄋㄢˊ', ans: 'b', emoji: '👦' },
      { word: '牛奶', at: 0, zy: 'ㄋㄧㄡˊ', ans: 'b', emoji: '🥛' }, { word: '小鳥', at: 1, zy: 'ㄋㄧㄠˇ', ans: 'b', emoji: '🐦' },
    ] },
  { id: 'zh-z', a: 'ㄓ', b: 'ㄗ', title: '翹舌 ㄓ／平舌 ㄗ', color: '#7b5cc4',
    tipA: '舌尖往上翹，頂住上顎。', tipB: '舌尖平平的，頂住上排牙齒後面。',
    items: [
      { word: '小豬', at: 1, zy: 'ㄓㄨ', ans: 'a', emoji: '🐷' }, { word: '蜘蛛', at: 0, zy: 'ㄓ', ans: 'a', emoji: '🕷️' },
      { word: '桌子', at: 0, zy: 'ㄓㄨㄛ', ans: 'a', emoji: '🪑' }, { word: '竹子', at: 0, zy: 'ㄓㄨˊ', ans: 'a', emoji: '🎋' },
      { word: '足球', at: 0, zy: 'ㄗㄨˊ', ans: 'b', emoji: '⚽' }, { word: '嘴巴', at: 0, zy: 'ㄗㄨㄟˇ', ans: 'b', emoji: '👄' },
      { word: '寫字', at: 1, zy: 'ㄗˋ', ans: 'b', emoji: '✍️' }, { word: '早安', at: 0, zy: 'ㄗㄠˇ', ans: 'b', emoji: '🌅' },
    ] },
  { id: 'sh-s', a: 'ㄕ', b: 'ㄙ', title: '翹舌 ㄕ／平舌 ㄙ', color: '#c9a227',
    tipA: '舌尖往上翹，讓氣從縫裡摩擦出來。', tipB: '舌尖平平的靠近牙齒，讓氣「嘶嘶」出來。',
    items: [
      { word: '獅子', at: 0, zy: 'ㄕ', ans: 'a', emoji: '🦁' }, { word: '書本', at: 0, zy: 'ㄕㄨ', ans: 'a', emoji: '📚' },
      { word: '大樹', at: 1, zy: 'ㄕㄨˋ', ans: 'a', emoji: '🌳' }, { word: '高山', at: 1, zy: 'ㄕㄢ', ans: 'a', emoji: '⛰️' },
      { word: '三個', at: 0, zy: 'ㄙㄢ', ans: 'b', emoji: '3️⃣' }, { word: '雨傘', at: 1, zy: 'ㄙㄢˇ', ans: 'b', emoji: '☂️' },
      { word: '松鼠', at: 0, zy: 'ㄙㄨㄥ', ans: 'b', emoji: '🐿️' }, { word: '森林', at: 0, zy: 'ㄙㄣ', ans: 'b', emoji: '🌲' },
    ] },
  { id: 'f-h', a: 'ㄈ', b: 'ㄏ', title: '唇齒音 ㄈ／舌根音 ㄏ', color: '#f08a3c',
    tipA: '上排牙齒輕咬下嘴唇，吹出氣。', tipB: '嘴巴張開，氣從喉嚨後面摩擦出來，不用咬嘴唇。',
    items: [
      { word: '飛機', at: 0, zy: 'ㄈㄟ', ans: 'a', emoji: '✈️' }, { word: '風箏', at: 0, zy: 'ㄈㄥ', ans: 'a', emoji: '🪁' },
      { word: '蜜蜂', at: 1, zy: 'ㄈㄥ', ans: 'a', emoji: '🐝' }, { word: '衣服', at: 1, zy: 'ㄈㄨˊ', ans: 'a', emoji: '👕' },
      { word: '黑色', at: 0, zy: 'ㄏㄟ', ans: 'b', emoji: '⚫' }, { word: '花朵', at: 0, zy: 'ㄏㄨㄚ', ans: 'b', emoji: '🌸' },
      { word: '猴子', at: 0, zy: 'ㄏㄡˊ', ans: 'b', emoji: '🐵' }, { word: '喝水', at: 0, zy: 'ㄏㄜ', ans: 'b', emoji: '🥤' },
    ] },
];
// 某個注音有哪些容易混淆的對：ZHUYIN_PAIRS_OF['ㄣ'] → [pair]
window.ZHUYIN_PAIRS_OF = {};
for (const pr of window.ZHUYIN_PAIRS) for (const ch of [pr.a, pr.b]) (window.ZHUYIN_PAIRS_OF[ch] = window.ZHUYIN_PAIRS_OF[ch] || []).push(pr);

// ═════════ 詞語庫：更多生活常見的詞（圖＋每個字的注音） ═════════
// 單元例詞、聽音辨識的例詞也會自動加進來。遊戲與首頁的題目都從這裡挑，詞就不會一直重複。
//   ZHUYIN_WORDS                         [{ word, zy: ['ㄅㄠ', 'ㄗ˙'], emoji }]
//   zhuyinWordsWith('ㄅ', { first })     含有 ㄅ 的詞（first = 某個字的第一個注音就是 ㄅ）→ [{ ...詞, i: 第幾個字 }]
window.ZHUYIN_WORDS = [
  ['包子', 'ㄅㄠ ㄗ˙', '🥟'], ['冰塊', 'ㄅㄧㄥ ㄎㄨㄞˋ', '🧊'], ['鼻子', 'ㄅㄧˊ ㄗ˙', '👃'], ['白雲', 'ㄅㄞˊ ㄩㄣˊ', '☁️'], ['斑馬', 'ㄅㄢ ㄇㄚˇ', '🦓'],
  ['貝殼', 'ㄅㄟˋ ㄎㄜˊ', '🐚'], ['冰淇淋', 'ㄅㄧㄥ ㄑㄧˊ ㄌㄧㄣˊ', '🍦'],
  ['皮球', 'ㄆㄧˊ ㄑㄧㄡˊ', '🏐'], ['蘋果', 'ㄆㄧㄥˊ ㄍㄨㄛˇ', '🍎'],
  ['貓咪', 'ㄇㄠ ㄇㄧ', '🐈'], ['帽子', 'ㄇㄠˋ ㄗ˙', '🧢'], ['麵包', 'ㄇㄧㄢˋ ㄅㄠ', '🍞'], ['米飯', 'ㄇㄧˇ ㄈㄢˋ', '🍚'], ['蘑菇', 'ㄇㄛˊ ㄍㄨ', '🍄'],
  ['螞蟻', 'ㄇㄚˇ ㄧˇ', '🐜'],
  ['飯糰', 'ㄈㄢˋ ㄊㄨㄢˊ', '🍙'], ['房子', 'ㄈㄤˊ ㄗ˙', '🏠'], ['鳳梨', 'ㄈㄥˋ ㄌㄧˊ', '🍍'],
  ['蛋糕', 'ㄉㄢˋ ㄍㄠ', '🍰'], ['燈泡', 'ㄉㄥ ㄆㄠˋ', '💡'], ['電視', 'ㄉㄧㄢˋ ㄕˋ', '📺'], ['電話', 'ㄉㄧㄢˋ ㄏㄨㄚˋ', '☎️'],
  ['太陽', 'ㄊㄞˋ ㄧㄤˊ', '☀️'], ['湯匙', 'ㄊㄤ ㄔˊ', '🥄'], ['頭髮', 'ㄊㄡˊ ㄈㄚˇ', '💇'],
  ['南瓜', 'ㄋㄢˊ ㄍㄨㄚ', '🎃'], ['檸檬', 'ㄋㄧㄥˊ ㄇㄥˊ', '🍋'], ['鬧鐘', 'ㄋㄠˋ ㄓㄨㄥ', '⏰'],
  ['老鼠', 'ㄌㄠˇ ㄕㄨˇ', '🐭'], ['鈴鐺', 'ㄌㄧㄥˊ ㄉㄤ', '🔔'], ['龍蝦', 'ㄌㄨㄥˊ ㄒㄧㄚ', '🦞'], ['老師', 'ㄌㄠˇ ㄕ', '🧑‍🏫'], ['樓梯', 'ㄌㄡˊ ㄊㄧ', '🪜'],
  ['禮物', 'ㄌㄧˇ ㄨˋ', '🎁'], ['老鷹', 'ㄌㄠˇ ㄧㄥ', '🦅'],
  ['鴿子', 'ㄍㄜ ㄗ˙', '🕊️'], ['公雞', 'ㄍㄨㄥ ㄐㄧ', '🐓'], ['鋼琴', 'ㄍㄤ ㄑㄧㄣˊ', '🎹'], ['公車', 'ㄍㄨㄥ ㄔㄜ', '🚌'], ['鍋子', 'ㄍㄨㄛ ㄗ˙', '🍳'],
  ['蝸牛', 'ㄍㄨㄚ ㄋㄧㄡˊ', '🐌'],
  ['卡車', 'ㄎㄚˇ ㄔㄜ', '🚚'], ['褲子', 'ㄎㄨˋ ㄗ˙', '👖'], ['口罩', 'ㄎㄡˇ ㄓㄠˋ', '😷'],
  ['火車', 'ㄏㄨㄛˇ ㄔㄜ', '🚂'], ['河馬', 'ㄏㄜˊ ㄇㄚˇ', '🦛'], ['漢堡', 'ㄏㄢˋ ㄅㄠˇ', '🍔'], ['蝴蝶', 'ㄏㄨˊ ㄉㄧㄝˊ', '🦋'], ['狐狸', 'ㄏㄨˊ ㄌㄧˊ', '🦊'],
  ['海豚', 'ㄏㄞˇ ㄊㄨㄣˊ', '🐬'], ['火山', 'ㄏㄨㄛˇ ㄕㄢ', '🌋'], ['喝茶', 'ㄏㄜ ㄔㄚˊ', '🍵'],
  ['橘子', 'ㄐㄩˊ ㄗ˙', '🍊'], ['剪刀', 'ㄐㄧㄢˇ ㄉㄠ', '✂️'], ['腳踏車', 'ㄐㄧㄠˇ ㄊㄚˋ ㄔㄜ', '🚲'], ['機器人', 'ㄐㄧ ㄑㄧˋ ㄖㄣˊ', '🤖'],
  ['汽車', 'ㄑㄧˋ ㄔㄜ', '🚙'], ['青蛙', 'ㄑㄧㄥ ㄨㄚ', '🐸'], ['氣球', 'ㄑㄧˋ ㄑㄧㄡˊ', '🎈'], ['鉛筆', 'ㄑㄧㄢ ㄅㄧˇ', '✏️'], ['青菜', 'ㄑㄧㄥ ㄘㄞˋ', '🥬'],
  ['熊貓', 'ㄒㄩㄥˊ ㄇㄠ', '🐼'], ['鞋子', 'ㄒㄧㄝˊ ㄗ˙', '👟'], ['香蕉', 'ㄒㄧㄤ ㄐㄧㄠ', '🍌'], ['小蛇', 'ㄒㄧㄠˇ ㄕㄜˊ', '🐍'], ['學校', 'ㄒㄩㄝˊ ㄒㄧㄠˋ', '🏫'],
  ['雪人', 'ㄒㄩㄝˇ ㄖㄣˊ', '⛄'], ['信封', 'ㄒㄧㄣˋ ㄈㄥ', '✉️'], ['下雨', 'ㄒㄧㄚˋ ㄩˇ', '🌧️'],
  ['章魚', 'ㄓㄤ ㄩˊ', '🐙'], ['蠟燭', 'ㄌㄚˋ ㄓㄨˊ', '🕯️'], ['直尺', 'ㄓˊ ㄔˇ', '📏'],
  ['窗戶', 'ㄔㄨㄤ ㄏㄨˋ', '🪟'], ['叉子', 'ㄔㄚ ㄗ˙', '🍴'],
  ['書包', 'ㄕㄨ ㄅㄠ', '🎒'], ['手錶', 'ㄕㄡˇ ㄅㄧㄠˇ', '⌚'], ['山羊', 'ㄕㄢ ㄧㄤˊ', '🐐'], ['樹葉', 'ㄕㄨˋ ㄧㄝˋ', '🍃'], ['鯊魚', 'ㄕㄚ ㄩˊ', '🦈'],
  ['手套', 'ㄕㄡˇ ㄊㄠˋ', '🧤'],
  ['日出', 'ㄖˋ ㄔㄨ', '🌄'],
  ['鑽石', 'ㄗㄨㄢˋ ㄕˊ', '💎'],
  ['刺蝟', 'ㄘˋ ㄨㄟˋ', '🦔'], ['洋蔥', 'ㄧㄤˊ ㄘㄨㄥ', '🧅'], ['彩虹', 'ㄘㄞˇ ㄏㄨㄥˊ', '🌈'],
  ['掃把', 'ㄙㄠˋ ㄅㄚˇ', '🧹'],
  ['椅子', 'ㄧˇ ㄗ˙', '🪑'], ['眼睛', 'ㄧㄢˇ ㄐㄧㄥ', '👁️'], ['牙刷', 'ㄧㄚˊ ㄕㄨㄚ', '🪥'], ['葉子', 'ㄧㄝˋ ㄗ˙', '🍂'], ['鑰匙', 'ㄧㄠˋ ㄕ˙', '🔑'],
  ['鸚鵡', 'ㄧㄥ ㄨˇ', '🦜'], ['櫻桃', 'ㄧㄥ ㄊㄠˊ', '🍒'], ['音樂', 'ㄧㄣ ㄩㄝˋ', '🎵'],
  ['娃娃', 'ㄨㄚˊ ㄨㄚ˙', '🧸'], ['襪子', 'ㄨㄚˋ ㄗ˙', '🧦'], ['蚊子', 'ㄨㄣˊ ㄗ˙', '🦟'], ['網球', 'ㄨㄤˇ ㄑㄧㄡˊ', '🎾'], ['王冠', 'ㄨㄤˊ ㄍㄨㄢ', '👑'],
  ['圍巾', 'ㄨㄟˊ ㄐㄧㄣ', '🧣'],
  ['月亮', 'ㄩㄝˋ ㄌㄧㄤˋ', '🌙'], ['玉米', 'ㄩˋ ㄇㄧˇ', '🌽'],
  ['耳機', 'ㄦˇ ㄐㄧ', '🎧'],
].map(([word, zy, emoji]) => ({ word, zy: zy.split(' '), emoji }));
(() => {                                                   // 單元例詞、聽音辨識的例詞也加進詞語庫
  const has = new Set(window.ZHUYIN_WORDS.map(w => w.word)), seenEmoji = new Set(window.ZHUYIN_WORDS.map(w => w.emoji));
  const add = (word, zy, emoji) => { if (has.has(word) || zy.length !== [...word].length) return; has.add(word); window.ZHUYIN_WORDS.push({ word, zy, emoji, dupEmoji: seenEmoji.has(emoji) }); seenEmoji.add(emoji); };
  for (const u of window.ZHUYIN_UNITS) for (const s of u.symbols) add(s.word, s.reading, s.emoji);
  // 聽音辨識的例詞只有其中一個字的注音，沒有整個詞的注音，所以不加
})();
window.zhuyinWordsWith = function (ch, { first = false } = {}) {
  const out = [];
  for (const w of window.ZHUYIN_WORDS) {
    const i = w.zy.findIndex(z => first ? z.replace(/^˙/, '')[0] === ch : z.includes(ch));
    if (i >= 0) out.push({ ...w, i });
  }
  return out;
};
