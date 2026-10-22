# 小簡的注音大冒險

注音教育互動網站：教材展示、分單元學習單、瑪利歐風格的冒險遊戲。

**線上使用：** https://u11317029.github.io/game11233/ （建議使用 Chrome）

## 網站內容

| 頁面 | 檔案 | 說明 |
| --- | --- | --- |
| 🏠 整體入口 | `index.html` | 三個入口、單元地圖、教師使用說明 |
| 📚 教材展示 | `materials.html` | 37 個注音分 10 單元；看圖、聽發音、描寫、手勢空中寫；投影模式 |
| 📝 學習單 | `worksheet.html?unit=1`～`10` | 認一認、描一描、聽一聽、圈一圈、連一連；線上批改或 A4 列印 |
| 🎮 冒險遊戲 | `game.html` | 跳台階、踩小怪物、收集寶石；遇到大怪物時用手勢在空中寫注音 |

## 程式結構
- `js/zhuyin-data.js`：單元、符號、例詞、注音、發音提示（要改課程內容只改這裡）
- `js/airwriter.js`：注音辨識、MediaPipe 手勢偵測、寫字板、朗讀（遊戲與教材共用）
- `css/site.css`：入口、教材、學習單共用樣式

## 空中寫字手勢
☝️ 只伸出食指：寫字　🖐️ 張開手掌停一下：送出　✊ 握拳停一下：擦掉

手勢偵測使用 [MediaPipe Hand Landmarker](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)，需要相機與網路（第一次約下載 8MB 模型）。沒有相機也可以用滑鼠或觸控寫。
