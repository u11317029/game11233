# 小簡的注音大冒險

注音教育互動網站：教材展示、分單元學習單、瑪利歐風格的冒險遊戲。

**線上使用：** https://u11317029.github.io/game11233/ （建議使用 Chrome）

## 網站內容

| 頁面 | 檔案 | 說明 |
| --- | --- | --- |
| 🏠 整體入口 | `index.html` | 會說話的小簡與注音泡泡、故事繪本、今日注音、泡泡暖身小遊戲、學習進度與徽章、單元冒險地圖、教師專區 |
| 📚 教材展示 | `materials.html` | 37 個注音分 10 單元；看圖、聽發音、描寫、手勢空中寫；投影模式 |
| 📝 學習單 | `worksheet.html?unit=1`～`10` | 認一認、描一描、聽一聽、圈一圈、連一連；線上批改或 A4 列印 |
| 🎮 冒險遊戲 | `game.html` | 跳台階、踩小怪物、收集寶石；遇到大怪物時用手勢在空中寫注音 |

## 程式結構
- `js/zhuyin-data.js`：單元、符號、例詞、注音、發音提示（要改課程內容只改這裡）
- `js/airwriter.js`：注音辨識、MediaPipe 手勢偵測、寫字板、朗讀（遊戲與教材共用）
- `js/progress.js`：學習紀錄（存在瀏覽器 localStorage，首頁進度與徽章讀這裡）
- `css/site.css`：入口、教材、學習單共用樣式
- `assets/story/`：故事繪本插圖

## 空中寫字手勢
☝️ 只伸出食指：寫字　🖐️ 張開手掌停一下：送出　✊ 握拳停一下：擦掉

手勢偵測使用 [MediaPipe Hand Landmarker](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)，需要相機與網路（第一次約下載 8MB 模型）。沒有相機也可以用滑鼠或觸控寫。

## 冒險遊戲玩法
- ❤️ 3 顆愛心：被怪物碰到或掉進坑會少一顆，用完從 🚩 存檔點重新出發（不會 Game Over）
- ❓ 問號方塊：從下面頂，會掉出寶石、愛心或 🪄 魔杖
- 🪄 魔杖：20 秒內按 `X`（平板按「魔」）發射魔法，什麼怪物都打得倒
- 🍄 彈簧蘑菇：可以跳到高空獎勵台
- 怪物：小綠怪、注音史萊姆、蝙蝠（可以踩）；刺刺球、生氣方塊（不能踩）；害羞幽靈（只怕魔法）
- 大怪物：龍與墨水章魚輪流出現，每約 100 公尺一隻，用空中寫注音打敗

## 素材來源
- 像素素材：[Kenney – Pixel Platformer](https://kenney.nl/assets/pixel-platformer)（CC0，`assets/kenney/`）
- 像素字型：[俐方體11號 Cubic 11](https://github.com/ACh-K/Cubic-11)（免費字型）
- 注音史萊姆、害羞幽靈、墨水章魚、魔杖：程式內以像素陣列繪製（`game.html` 的 `PIX`、`buildOctopus`）
- 小簡、龍、小綠怪、場景：作者原創插圖
