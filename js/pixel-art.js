// ═════════ 像素圖示（全站共用） ═════════
// 例詞的圖（大象、西瓜…）原本是系統表情符號，每台電腦長得不一樣；
// 這裡把它們重新畫成「像素小圖」：縮小取樣 → 色彩減色 → 加深色外框，跟整個網站的像素風一致。
//   PixelArt.canvas('🐘', 24)   回傳像素小圖 canvas（遊戲裡用 drawImage 畫，記得關掉平滑）
//   PixelArt.url('🐘', 24)      回傳 dataURL（網頁 <img> 用）
//   PixelArt.img('🐘', 24, cls) 回傳 <img> 的 HTML 字串
//   PixelArt.icon(name)         UI 圖示（自己畫的像素圖，見 ICONS），回傳 <img> 的 HTML 字串
//   PixelArt.hydrate(root)      把 <i data-px="🐘"> / <i data-icon="home"> 換成像素圖
window.PixelArt = (() => {
  const INK = '#3b2414';
  const cache = {};
  const FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  function outlineCanvas(n, colorAt) {                    // n×n 的顏色表 → 外加 1 格深色描邊
    const c = document.createElement('canvas');
    c.width = c.height = n + 2;
    const g = c.getContext('2d');
    for (let y = -1; y <= n; y++) for (let x = -1; x <= n; x++) {
      let col = (x >= 0 && y >= 0 && x < n && y < n) ? colorAt(x, y) : null;
      if (!col && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => { const X = x + a, Y = y + b; return X >= 0 && Y >= 0 && X < n && Y < n && colorAt(X, Y); })) col = INK;
      if (col) { g.fillStyle = col; g.fillRect(x + 1, y + 1, 1, 1); }
    }
    return c;
  }

  function canvas(e, n = 24) {
    const key = e + '|' + n;
    if (cache[key]) return cache[key];
    const big = document.createElement('canvas');
    big.width = big.height = n * 4;
    const g = big.getContext('2d');
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `${n * 3.3}px ${FONT}`;
    g.fillText(e, n * 2, n * 2.18);
    const sm = document.createElement('canvas');
    sm.width = sm.height = n;
    const s = sm.getContext('2d');
    s.imageSmoothingEnabled = true; s.imageSmoothingQuality = 'high';
    s.drawImage(big, 0, 0, n, n);
    const d = s.getImageData(0, 0, n, n).data;
    const q = v => Math.min(255, Math.round(v / 28) * 28);   // 減色：顏色變成一塊一塊
    const sat = (r, gg, b) => {                                // 稍微調鮮豔一點，比較像遊戲圖
      const m = (r + gg + b) / 3, k = 1.18;
      return [r, gg, b].map(v => Math.max(0, Math.min(255, m + (v - m) * k)));
    };
    const colorAt = (x, y) => {
      const i = (y * n + x) * 4;
      if (d[i + 3] < 120) return null;
      const [r, gg, b] = sat(d[i], d[i + 1], d[i + 2]);
      return `rgb(${q(r)},${q(gg)},${q(b)})`;
    };
    return (cache[key] = outlineCanvas(n, colorAt));
  }
  const urls = {};
  const url = (e, n = 24) => urls[e + '|' + n] || (urls[e + '|' + n] = canvas(e, n).toDataURL());
  const img = (e, n = 24, cls = 'pxi') => `<img class="${cls}" src="${url(e, n)}" alt="" draggable="false">`;

  // ───────── 自己畫的 UI 圖示（16×16）：每個字母一種顏色，'.' 透明 ─────────
  const PAL = { k: INK, w: '#ffffff', y: '#ffcf3f', Y: '#f0a020', o: '#f08a3c', O: '#d0552b', r: '#e8503a', R: '#a8281a', p: '#ff8fa3',
                g: '#6fd36b', G: '#3fa34d', b: '#4fc3f7', B: '#1d7fc4', v: '#b48aea', V: '#7b5cc4', n: '#c9905a', N: '#8a5a32', s: '#d8e8f5', S: '#9ab0c8',
                c: '#fff3d6', t: '#3cc6d8', m: '#7a6450' };
  const ICONS = {
    home: ['......kk........', '.....kook.......', '....kooook......', '...kooooook.....', '..kooooooook....', '.kooooooooook...', 'kkkkkkkkkkkkkk..',
           '.kccccccccck....', '.kcbbkcccccck...', '.kcbbkckkkcck...', '.kckkkckNkcck...', '.kcccccNNkcck...', '.kcccccNNkcck...', '.kkkkkkkkkkkk...'],
    map: ['................', 'kkkkkkkkkkkkkk..', 'kcccckgggkcccck.', 'kcrcckggGkccbck.', 'kcccckgGgkcbbck.', 'kccrckggGkcccck.', 'kccccrgGgkcccck.', 'kccccckrgkcccck.',
          'kcccckgrGkcccck.', 'kcccckgGrrrrcck.', 'kcccckggGkccrRk.', 'kcccckgGgkccRRk.', 'kkkkkkkkkkkkkkk.'],
    book: ['................', '.kkkkkk.kkkkkk..', 'kbbbbbbkkooooook', 'kbwwwwbkkowwwwok', 'kbwbbwbkkowoowok', 'kbwwwwbkkowwwwok', 'kbwbbwbkkowoowok', 'kbwwwwbkkowwwwok',
           'kbbbbbbkkooooook', 'kkkkkkkkkkkkkkkk', '.......kk.......'],
    game: ['................', '................', '..kkkkkkkkkkkk..', '.kvvvvvvvvvvvvk.', 'kvvkvvvvvvvvrvvk', 'kvkkkvvvvvvrvrvk', 'kvvkvvvvvvvvrvvk', 'kvvvvvkvvkvvvvvk',
           'kvvvvvvvvvvvvvvk', '.kvvvvkkkkvvvvk.', '..kkkk....kkkk..'],
    ear: ['....kkkkkk......', '...kppppppk.....', '..kppkkkkppk....', '..kpk....kppk...', '..kpk.kk..kpk...', '..kppkpk..kpk...', '...kkppk..kpk...', '.....kpk.kppk...',
          '....kppk.kpk....', '...kppk.kppk....', '...kpk..kpk.....', '...kpkkkppk.....', '....kppppk......', '.....kkkk.......'],
    pencil: ['...........kk...', '..........kppk..', '.........kppppk.', '........kyykppk.', '.......kyyyykk..', '......kyyyyyk...', '.....kyyyyyk....', '....kyyyyyk.....',
             '...kyyyyyk......', '..kNNyyyk.......', '..kNNNyk........', '..kkNNk.........', '..kkkk..........'],
    sheet: ['..kkkkkkkkkk....', '..kwwwwwwwwkk...', '..kwkkkkkwwwkk..', '..kwwwwwwwwwwk..', '..kwkkkkkkkwwk..', '..kwwwwwwwwwwk..', '..kwkkkkkwwwwk..', '..kwwwwwwwgwwk..',
            '..kwkkkkwwgGwk..', '..kwwwwwwgGwwk..', '..kwwwwwGgwwwk..', '..kwwwwwwwwwwk..', '..kkkkkkkkkkkk..'],
    sun: ['.......kk.......', '..k....yy....k..', '...k...yy...k...', '.......kk.......', '.....kkkkkk.....', '....kyyyyyyk....', '.kyykyyyyyyykyyk', '.kyykyYyyyyykyyk',
          '....kyyyyyyk....', '.....kkkkkk.....', '...k........k...', '..k....yy....k..', '.......yy.......'],
    rainbow: ['................', '....kkkkkkkk....', '..kkrrrrrrrrkk..', '.krrooooooooorrk', 'kroyyyyyyyyyyork', 'kroyggggggggyork', 'kroygbbbbbbgyork', 'kroygbkkkkbgyork',
              'kroygbk..kbgyork', 'kkkkkkk..kkkkkkk'],
    medal: ['..kkk....kkk....', '..kbbk..krrk....', '...kbbkkrrk.....', '....kbbrrk......', '.....kkkk.......', '....kyyyyk......', '...kyYwwYyk.....', '..kyYwyyYYyk....',
            '..kyYyyyYYyk....', '..kyyYYYYyyk....', '...kyyyyyyk.....', '....kkkkkk......'],
    teacher: ['.....kkkkk......', '....kNNNNNk.....', '...kNnnnnnNk....', '...kNnknknNk....', '...kNnnnnnNk....', '....knnppnk.....', '.....kkkkk......', '...kkBBBBBkk....',
              '..kBBBwwwBBBk...', '..kBBBwwwBBBk...', '..kBkBBBBBkBk...', '..kkkBBBBBkkk...', '....kBBkBBk.....', '....kkk.kkk.....'],
    eye: ['................', '................', '....kkkkkkkk....', '..kkwwwwwwwwkk..', '.kwwwwkkkkwwwwk.', 'kwwwwkbbbbkwwwwk', 'kwwwkbbkkbbkwwwk', 'kwwwkbbkkbbkwwwk',
          'kwwwwkbbbbkwwwwk', '.kwwwwkkkkwwwwk.', '..kkwwwwwwwwkk..', '....kkkkkkkk....'],
    hand: ['......kk........', '.....kcck.......', '.....kcck.......', '.....kcck.......', '.....kcckkk.....', '.....kcckcckk...', '..kk.kcckcckcck.', '.kcckkcccccckcck',
           '.kccckccccccccck', '..kccccccccccck.', '...kcccccccccck.', '....kccccccccck.', '.....kcccccck...', '......kkkkkk....'],
    star: ['.......kk.......', '......kyyk......', '......kyyk......', '.....kyyyyk.....', 'kkkkkkyyyykkkkkk', 'kyyyyyyyyyyyyyyk', '.kyyyyyyyyyyyyk.', '..kyyyyyyyyyyk..',
           '...kyyyyyyyyk...', '..kyyyyyyyyyyk..', '..kyyyykkyyyyk..', '.kyyyk....kyyyk.', '.kyyk......kyyk.', '.kkk........kkk.'],
    gem: ['....kkkkkkk.....', '...kbwbbbbbk....', '..kbwbbbbbbbk...', '.kkkkkkkkkkkkk..', '.kbbbbbBBBbbBk..', '..kbbbbBBbbBk...', '...kbbbBbbBk....', '....kbbbbBk.....',
          '.....kbbBk......', '......kBk.......', '.......k........'],
    heart: ['................', '.kkkk....kkkk...', 'krrrrk..krrrrk..', 'krwwrrkkrrrrrk..', 'krwrrrrrrrrrrk..', 'krrrrrrrrrrrRk..', '.krrrrrrrrrrRk..', '..krrrrrrrrRk...',
            '...krrrrrrRk....', '....krrrrRk.....', '.....krrRk......', '......kRk.......', '.......k........'],
    sound: ['......k.........', '.....kk.....k...', '....kwk..k...k..', 'kkkkwwk...k..k..', 'kwwwwwk.k..k..k.', 'kwwwwwk..k.k..k.', 'kwwwwwk..k.k..k.', 'kwwwwwk.k..k..k.',
            'kkkkwwk...k..k..', '....kwk..k...k..', '.....kk.....k...', '......k.........'],
    mute: ['......k.........', '.....kk.........', '....kwk.........', 'kkkkwwk..r...r..', 'kwwwwwk...r.r...', 'kwwwwwk....r....', 'kwwwwwk...r.r...', 'kkkkwwk..r...r..',
           '....kwk.........', '.....kk.........', '......k.........'],
    speak: ['..kkkkkkkkkkk...', '.kwwwwwwwwwwwk..', 'kwwkkwwkkwwkkwk.', 'kwwkkwwkkwwkkwk.', '.kwwwwwwwwwwwk..', '..kkkkwwkkkkk...', '.....kwk........', '.....kk.........'],
    trash: ['......kkkk......', '..kkkkkkkkkkkk..', '..kSSSSSSSSSSk..', '...kkkkkkkkkk...', '...kSsSsSsSSk...', '...kSsSsSsSSk...', '...kSsSsSsSSk...', '...kSsSsSsSSk...',
            '...kSsSsSsSSk...', '....kkkkkkkk....'],
    dice: ['................', '.kkkkkkkkkkkk...', '.kwwwwwwwwwwk...', '.kwkkwwwwkkwk...', '.kwkkwwwwkkwk...', '.kwwwwkkwwwwk...', '.kwwwwkkwwwwk...', '.kwkkwwwwkkwk...',
           '.kwkkwwwwkkwk...', '.kwwwwwwwwwwk...', '.kkkkkkkkkkkk...'],
    bubble: ['.....kkkkkk.....', '...kkbbbbbbkk...', '..kbbwwbbbbbbk..', '.kbbwwbbbbbbbbk.', '.kbwwbbbbbbbbbk.', 'kbbwbbbbbbbbbbbk', 'kbbbbbbbbbbbbbbk', 'kbbbbbbbbbbbbbbk',
              'kbbbbbbbbbbbbBBk', '.kbbbbbbbbbbbBk.', '.kbbbbbbbbbbBBk.', '..kbbbbbbbbBBk..', '...kkbbbbBBkk...', '.....kkkkkk.....'],
    calendar: ['..k.....k.......', '.kkkkkkkkkkkk...', '.krrrrrrrrrrk...', '.krrkrrrrkrrk...', '.kkkkkkkkkkkk...', '.kwwwwwwwwwwk...', '.kwkwkwkwkwwk...', '.kwwwwwwwwwwk...',
                 '.kwkwkwkwkwwk...', '.kwwwwwwwwwwk...', '.kkkkkkkkkkkk...'],
    print: ['....kkkkkkkk....', '....kwwwwwwk....', '....kwkkkkwk....', '..kkkkkkkkkkkk..', '.kSSSSSSSSSSSSk.', '.kSSSSSSSSSgSSk.', '.kSSSSSSSSSSSSk.', '.kSSkkkkkkkkSSk.',
            '..kkkwwwwwwkkk..', '....kwkkkkwk....', '....kwwwwwwk....', '....kkkkkkkk....'],
    target: ['.....kkkkkk.....', '...kkrrrrrrkk...', '..krrwwwwwwrrk..', '.krwwrrrrrrwwrk.', '.krwrrwwwwrrwrk.', 'krwrrwrrrrwrrwrk', 'krwrwrrkkrrwrwrk', 'krwrwrkkkkrwrwrk',
             'krwrwrrkkrrwrwrk', 'krwrrwrrrrwrrwrk', '.krwrrwwwwrrwrk.', '.krwwrrrrrrwwrk.', '..krrwwwwwwrrk..', '...kkrrrrrrkk...', '.....kkkkkk.....'],
    pc: ['................', '.kkkkkkkkkkkkkk.', '.kBBBBBBBBBBBBk.', '.kBbbbbbbbbbbBk.', '.kBbbbbbbbbbbBk.', '.kBbbbbbbbbbbBk.', '.kBBBBBBBBBBBBk.', '.kkkkkkkkkkkkkk.',
         '......kSSk......', '....kkkkkkkk....'],
    question: ['....kkkkkkk.....', '...kyyyyyyyk....', '..kyyykkkyyyk...', '..kyyk...kyyk...', '..kkk....kyyk...', '........kyyk....', '.......kyyk.....', '......kyyk......',
               '......kyyk......', '......kkkk......', '......kyyk......', '......kyyk......', '......kkkk......'],
    play: ['................', '..kk............', '..kgkk..........', '..kgggkk........', '..kgggggkk......', '..kgggggggkk....', '..kgggggggggk...', '..kgggggggkk....',
           '..kgggggkk......', '..kgggkk........', '..kgkk..........', '..kk............'],
    wand: ['............y...', '...........yyy..', '..........yyYyy.', '...........yyy..', '..........kky...', '.........kvk....', '........kvk.....', '.......kvk......',
           '......kvk.......', '.....kvk........', '....kvk.........', '...kvk..........', '...kk...........'],
    voice: ['.....kkkk.......', '....kSSSSk......', '....kSwwSk......', '....kSSSSk......', '....kSwwSk......', '....kSSSSk......', '..k.kSSSSk.k....', '..k..kkkk..k....',
            '...k......k.....', '....kkkkkk......', '.......k........', '.....kkkkk......'],
    flag: ['..k.............', '..kkkkkkkk......', '..krrrrrrrk.....', '..krrrrrrrrk....', '..krrrrrrrk.....', '..kkkkkkkk......', '..k.............', '..k.............',
           '..k.............', '..k.............', '.kkk............', 'kkkkk...........'],
    lock: ['.....kkkkk......', '....kSSSSSk.....', '...kSk...kSk....', '...kSk...kSk....', '..kkkkkkkkkkk...', '..kyyyyyyyyyk...', '..kyyyykyyyyk...', '..kyyykkkyyyk...',
           '..kyyyykyyyyk...', '..kYYYYYYYYYk...', '..kkkkkkkkkkk...'],
    infinity: ['................', '................', '..kkkk....kkkk..', '.kvvvvk..kvvvvk.', 'kvvkkvvkkvvkkvvk', 'kvk..kvvvvk..kvk', 'kvk..kvvvvk..kvk', 'kvvkkvvkkvvkkvvk',
               '.kvvvvk..kvvvvk.', '..kkkk....kkkk..'],
  };
  const iconUrls = {};
  const iconCache = {};
  function iconCanvas(name) {
    if (iconCache[name]) return iconCache[name];
    const rows = ICONS[name];
    if (!rows) return null;
    const w = Math.max(...rows.map(r => r.length)), h = rows.length, c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    rows.forEach((r, y) => [...r].forEach((ch, x) => { if (PAL[ch]) { g.fillStyle = PAL[ch]; g.fillRect(x, y, 1, 1); } }));
    return (iconCache[name] = c);
  }
  const iconUrl = name => iconUrls[name] || (iconUrls[name] = (iconCanvas(name) || canvas('❓', 16)).toDataURL());
  const icon = (name, cls = 'pxi') => `<img class="${cls}" src="${iconUrl(name)}" alt="" draggable="false">`;

  // <i data-px="🐘"></i>、<i data-icon="home"></i> → 像素圖
  function hydrate(root = document) {
    root.querySelectorAll('[data-px]').forEach(el => { el.outerHTML = img(el.dataset.px, +(el.dataset.n || 24), 'pxi ' + (el.className || '')); });
    root.querySelectorAll('[data-icon]').forEach(el => { el.outerHTML = icon(el.dataset.icon, 'pxi ' + (el.className || '')); });
  }

  return { canvas, url, img, icon, iconUrl, iconCanvas, hydrate, ICONS };
})();
