# 南越語學習網站研究筆記

更新日期：2026-04-29

## 產品方向

這個資料夾的第一版網站應該避免做成一般翻譯工具。核心定位是：

- 南越口音優先，而不是 generic `vi-VN`
- 真人資料與可追溯來源優先，而不是 TTS
- 日常對話優先，而不是抽象文法表
- 每筆教材都保留來源、狀態、是否需要南越母語者校對

## 已整合來源

### Vietnamese Maestro: Tones in the Southern dialect

網址：https://vietnamesemaestro.com/pronunciation/tones-in-the-southern-dialect/

用途：

- 南越聲調總覽
- 南越日常語音裡 `hỏi` 和 `ngã` 常合併
- 南越聲調練習不應照搬北越喉塞/聲門塞音邏輯

風險：

- 教學文章不是語音資料庫
- 需要用真人音檔驗證例句

### VietnameseLessons: Learn Southern Vietnamese

網址：https://vietnameselessons.com/guides/southern

用途：

- 南越口音入門總覽
- 南北差異、聲調、子音、尾音整理
- 可當未來資源索引

風險：

- 屬於整理型內容，不能當唯一標準

### SVFF

網址：https://svff.online/

用途：

- 南越教學機構參考
- 可借鏡課程分類：日常對話、發音、個人化場景

風險：

- 商業頁面資訊較概括
- 不應直接複製教材

### SVFF: Southern Vietnamese consonant sounds

網址：https://svff.online/blog/southern-vietnamese-consonant-sounds

用途：

- 補充南越子音規則：`v` 弱化接近 `y/w`、`d/gi` 接近 `y`、`tr` 接近 `ch`
- 補充尾音在自然語速中變軟的觀察

風險：

- 仍屬商業教學內容
- 發音細節需要真人音檔與多位說話者交叉確認

### VietFluent

網址：https://vietfluent.com/

用途：

- 南越/西貢式學習產品參考
- 強調生活情境、文化語境、真實對話與南越口音

風險：

- 商業頁面，資訊較概括
- 只作產品架構參考，不直接複製教材

### Quarterspeak

網址：https://www.quarterspeak.com/

用途：

- 南越學習 App 功能參考
- 城市地圖、詞卡、例句、真人音檔、日常情境等方向值得借鏡

風險：

- 商業產品，內容不可直接搬用
- 可參考功能類型，不參考其私有教材

### Learn Vietnamese With Annie

範例網址：https://www.youtube.com/watch?v=j-1fSw6bPx8

用途：

- 南越發音影片
- 可逐集整理 `v`、`qu`、母音、尾音等主題

風險：

- YouTube 影片授權不等於可下載或重用音訊
- 建議只做外部連結、筆記與自製練習

### Forvo Vietnamese

網址：https://forvo.com/languages/vi/

用途：

- 真人發音參考
- 可查單字多位說話者

風險：

- 不一定標示南越/北越
- 需要人工篩選說話者與口音

### YouGlish Vietnamese

網址：https://youglish.com/vietnamese

用途：

- 真實影片語境
- 可用於找自然語速例句

風險：

- 口音、字幕準確度與授權都需人工確認

## 建議資料模型

```json
{
  "id": "coffee-001",
  "vietnamese": "Cho em một ly cà phê sữa đá.",
  "zh_tw": "給我一杯越式冰奶咖啡。",
  "english": "Please give me an iced milk coffee.",
  "topic": "飲料",
  "level": "A1",
  "dialect": "southern",
  "status": "needs_native_audio",
  "source": "self-authored from verified pattern",
  "notes": ["em depends on relative age", "nha softens the request"],
  "audio": null
}
```

## 下一步

1. 新增 `data/phrases.json`，把目前寫在 `app.js` 的資料移出來。
2. 新增 `data/sources.json`，讓來源清單可維護。
3. 建立「母語者校對」欄位：`draft`、`reviewed`、`verified_southern`。
4. 收集真人南越音檔，僅使用自己錄製或明確可授權音檔。
5. 把真人音檔放到 `audio/native/`，命名建議：`phrase-id-speaker-region.wav`。
6. 加入單字複習排程與錯題紀錄。

## 音檔策略

目前 `audio/reference/` 內的 WAV 是聲調輪廓參考音，只用來練音高方向，不是真人語音，也不是 TTS。

真人南越音檔建議來源：

- 自己請南越母語者錄製並取得授權
- 自己上課時由老師錄製並確認可個人學習使用
- 可公開重用且明確授權的音檔

不建議直接下載或重用 YouTube、Forvo、商業 App 音檔，除非授權明確允許。
