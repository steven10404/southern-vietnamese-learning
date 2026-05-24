# RAG 問答架構

目前網站的 RAG 區塊是本機檢索式雛形，不需要 API key。

## 現在的流程

1. 載入 `data/content.json`
2. 把以下資料轉成知識項目：
   - `phrases`
   - `learnerProfile`
   - `rules`
   - `grammar`
   - `vocabulary`
   - `articles`
   - `lessons`
   - `sources`
3. 使用關鍵字與正規化越文檢索
4. 顯示答案與引用卡片

## 未來升級成真正 AI RAG

```text
User question
→ create embedding
→ vector search over phrases / rules / articles / lessons
→ send top matches as context to LLM
→ answer in Traditional Chinese with Southern Vietnamese notes
```

## 建議後端

不要在前端放 API key。之後可以新增：

- `server.mjs` API route: `POST /api/rag`
- 本機向量檔或 SQLite: `data/rag.sqlite`
- 每筆資料欄位：`id`, `type`, `title`, `text`, `metadata`, `embedding`

## 相關互動頁

- `map.html`：用情境連到文章、詞句、單詞和對話課
- `review.html`：用 `localStorage` 保存詞句複習狀態

## Prompt 原則

- 只根據檢索到的教材回答
- 不確定就說需要南越母語者確認
- 回答用繁體中文
- 越文例句保留聲調符號
- 標明資料來源類型：詞句、發音規則、對話課、來源
- 稱謂或自稱問題優先引用 `learnerProfile`
- 文法問題優先引用 `grammar`
- 單詞問題優先引用 `vocabulary`
- 閱讀或短文問題優先引用 `articles`
- 口音問題優先引用 `rules`
