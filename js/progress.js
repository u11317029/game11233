// ═════════ 學習紀錄（存在這台裝置的瀏覽器裡，首頁的進度與徽章會讀這裡） ═════════
//   zhuyin-progress  教材展示：每個符號寫對幾次      { 'ㄅ': 2, ... }
//   zhuyin-ws        學習單：每個單元最好成績         { 1: { stars, right, total }, ... }
//   zhuyin-game      冒險遊戲：最遠距離、最多寶石、打敗大怪物次數 { bestDist, bestGems, bossWins }
//   zhuyin-warmup    首頁泡泡暖身：最高分             { best }
//   zhuyin-levels    冒險遊戲關卡：每關最好星星數     { 1: { stars, gems }, ..., endlessBest }
window.ZhuyinProgress = {
  load(key, def = {}) {
    try { return Object.assign(def, JSON.parse(localStorage.getItem(key) || '{}')); } catch (e) { return def; }
  },
  save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  },
  update(key, fn) {
    const v = this.load(key);
    fn(v);
    this.save(key, v);
    return v;
  },
};
