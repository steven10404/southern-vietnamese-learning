# 南越語學習資料庫格式

目前網站使用 `data/content.json` 當作本機教材資料庫。這種方式不需要安裝資料庫軟體，也很容易備份、版本控制和人工編輯。

## 檔案位置

- `data/content.json`：主要教材資料庫
- `vocabulary.html`：單詞資料頁
- `phrases.html`：詞句資料頁
- `articles.html`：文章閱讀頁
- `map.html`：情境地圖頁
- `review.html`：本機複習箱頁
- `audio/reference/`：聲調輪廓參考音
- `audio/native/`：未來真人南越音檔建議放這裡

## 主要欄位

```json
{
  "tones": [],
  "learnerProfile": {},
  "rules": [],
  "grammar": [],
  "vocabulary": [],
  "articles": [],
  "routine": [],
  "lessons": [],
  "phrases": [],
  "sources": []
}
```

## 學習者視角

```json
{
  "title": "20 歲男性學習者視角",
  "summary": "教材預設使用 20 歲男性學習者的稱謂策略。",
  "rules": ["對年紀較大者常用 em 自稱。"],
  "examples": ["Dạ, cho em hỏi đường."]
}
```

這個欄位會顯示在首頁，也會被 RAG 納入檢索，用來回答稱謂、自稱、男性視角相關問題。

## 文章格式

```json
{
  "id": "morning-in-saigon",
  "title": "Buổi sáng ở Sài Gòn",
  "topic": "城市生活",
  "level": "A1",
  "summary": "短文摘要。",
  "southernFocus": "南越口語或情境重點。",
  "status": "teacher draft",
  "paragraphs": [
    {
      "vn": "Em ghé quán quen mua một ly cà phê sữa đá.",
      "zh": "我去熟悉的店買一杯冰牛奶咖啡。"
    }
  ],
  "vocabulary": [
    {
      "word": "ghé",
      "meaning": "順路去、短暫停留",
      "example": "Em ghé quán quen."
    }
  ],
  "grammar": [
    {
      "pattern": "hơi + 形容詞",
      "note": "表示有點。",
      "example": "Đường hơi đông."
    }
  ],
  "questions": ["主角早上買了什麼？"]
}
```

## 對話課格式

```json
{
  "id": "coffee",
  "title": "買咖啡",
  "focus": "點餐、甜度、冰塊",
  "level": "A1",
  "lines": [
    ["A", "Cho em một ly cà phê sữa đá.", "給我一杯越式冰奶咖啡。"]
  ],
  "notes": ["nha 是柔化語氣的口語尾詞。"]
}
```

## 文法核心格式

```json
{
  "id": "sentence-particles",
  "title": "語尾詞",
  "pattern": "nha / ha / hả / hen / đó / thôi",
  "level": "A1",
  "note": "語尾詞是南越自然度關鍵。",
  "examples": ["Từ từ nha.", "Em ở Đài Loan hả?"],
  "tags": ["南越", "口語", "語氣"]
}
```

## 詞句格式

```json
{
  "vn": "Từ từ nha.",
  "zh": "慢慢來喔。",
  "topic": "聊天",
  "level": "A1",
  "status": "southern colloquial"
}
```

## 單詞格式

```json
{
  "word": "quẹo",
  "meaning": "轉彎",
  "category": "交通",
  "level": "A1",
  "note": "南越問路、搭車很常用。",
  "example": "Đi thẳng rồi quẹo phải.",
  "exampleZh": "直走然後右轉。"
}
```

## 建議狀態

- `source pattern`：根據可靠來源和常見語料整理，尚未真人音檔確認
- `southern colloquial`：南越口語常見說法，仍可等待母語者確認
- `needs native audio`：需要真人南越音檔或母語者校對
- `verified southern`：已由南越母語者確認

## 下一階段 SQLite

如果之後要在網站裡新增、編輯、刪除教材，就可以把 `content.json` 升級成 SQLite。建議表格：

- `lessons`
- `lesson_lines`
- `phrases`
- `tones`
- `pronunciation_rules`
- `sources`
- `audio_assets`
- `review_items`
- `rag_chunks`
- `rag_embeddings`

目前先用 JSON，可以保留漂亮頁面，也讓教材擴充速度最快。

## RAG 區塊

目前 `app.js` 會把 `phrases`、`rules`、`grammar`、`vocabulary`、`articles`、`lessons`、`sources` 轉成可檢索的知識項目。未來接 LLM 時，可以先把這些知識項目切成 chunks，再建立 embedding。
