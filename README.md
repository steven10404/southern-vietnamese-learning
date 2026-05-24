# 南越語學習工作台

這是一個本機版南越越南語學習網站，重點放在南越口音、日常對話、核心文法、詞句複習、跟讀錄音與 RAG 知識庫問答。

教材目前預設為 20 歲男性學習者視角：對年紀較大者多用 `em` 自稱，對長輩可用 `con`，別人稱呼學習者時常用 `anh`。

## 開啟網站

在 PowerShell 進入專案資料夾：

```powershell
cd "C:\Users\steve\OneDrive\桌面\越南語學習(南越)"
node server.mjs
```

看到下面訊息後，用瀏覽器開啟：

```text
Southern Vietnamese learning site: http://localhost:5178
```

網址：

```text
http://localhost:5178
```

資料量比較大的頁面：

```text
http://localhost:5178/vocabulary.html
http://localhost:5178/phrases.html
http://localhost:5178/articles.html
http://localhost:5178/pronouns.html
http://localhost:5178/mistakes.html
```

不要直接雙擊 `index.html`，因為網站會讀取 `data/content.json`，需要透過 localhost 開啟。

## 目前功能

- 南越發音訓練
- 20 歲男性學習者稱謂設定
- 稱謂互動教練、實戰稱謂情境庫
- 日常對話課
- 核心口語文法
- 南越生活單詞
- 詞句資料庫
- 南越生活閱讀短文
- 文章頁 Google Translate 越文朗讀按鈕
- 南越生活情境地圖
- 常見錯誤雷達、說錯時的救火句
- 本機智慧複習箱
- 本機 RAG 問答
- 南越發音輸入朗讀、VieNeu-TTS 本機服務、發音提示與跟讀錄音
- 來源與校對筆記

## 重要檔案

```text
index.html                  首頁與主學習流程
pronouns.html               稱謂互動教練
vocabulary.html             單詞資料頁
phrases.html                詞句資料頁
articles.html               文章閱讀頁
map.html                    情境地圖頁
mistakes.html               常見錯誤雷達
review.html                 智慧複習箱
styles.css                  視覺設計
app.js                      前端互動、稱謂/錯誤資料與 RAG 檢索
server.mjs                  本機伺服器
tts/vieneu-local/           VieNeu-TTS 本機服務 wrapper
data/content.json           主要教材資料庫
audio/reference/            聲調輪廓參考音
docs/database.md            資料庫格式說明
docs/rag.md                 RAG 架構說明
docs/research.md            網路資料研究筆記
docs/three-pass-review.md   教學/技術/產品三輪審查
```

## 編輯教材

主要改這個檔案：

```text
data/content.json
```

目前資料類型：

- `tones`：聲調與參考音
- `rules`：南越發音規則
- `grammar`：核心文法
- `vocabulary`：生活單詞
- `articles`：生活閱讀短文
- `lessons`：日常對話課
- `phrases`：詞句資料庫
- `sources`：來源清單

改完 `content.json` 後，重新整理瀏覽器即可。

## 音檔

目前 `audio/reference/` 裡的音檔是聲調輪廓參考音，不是真人越南語發音。

南越發音輸入朗讀區會優先呼叫本機 VieNeu-TTS 服務：

```powershell
cd "C:\Users\steve\OneDrive\桌面\越南語學習(南越)\tts\vieneu-local"
.\setup.ps1
```

`setup.ps1` 只需要先做一次。之後啟動網站伺服器 `node server.mjs` 時，系統會自動檢查並背景啟動 VieNeu-TTS；第一次朗讀可能會稍慢。

回到：

```text
http://localhost:5178/#southern-reader
```

目前 wrapper 預設用 VieNeu `turbo` 模式，避免額外安裝 PyTorch。
南越發音區固定使用 `Xuân Vĩnh (Nam - Miền Nam)` 男聲。
VieNeu 產生的音檔維持原始輸出，不做 time-stretch。頁面上的速度條只控制瀏覽器播放倍率，並硬性限制在 `0.95x` 到 `1.05x`，避免異常慢速或拉長音訊。
VieNeu 原始音檔會快取在 `tts/vieneu-local/cache/`，快取鍵包含文字、聲音與模式。若要清掉快取，可執行 `powershell -ExecutionPolicy Bypass -File .\tts\vieneu-local\clear-cache.ps1`。

未來真人南越音檔建議放在：

```text
audio/native/
```

建議只使用自己錄製、老師授權、或明確可重用的音檔。

## RAG 問答

目前 RAG 是本機檢索式雛形：

```text
問題 → 搜尋 content.json → 顯示回答與引用卡片
```

引用卡片旁的播放鍵會朗讀該筆資料的越南文片段，使用同一套本機 VieNeu-TTS、固定男聲與安全速度。

目前尚未接真正 LLM 或 embeddings。未來可升級為：

```text
問題 → embedding → vector search → LLM 回答
```

API key 不應放在前端。若要接 LLM，應該新增後端 API，例如 `POST /api/rag`。

## 常見問題

### 網站打不開

確認伺服器是否正在跑：

```powershell
node server.mjs
```

然後開：

```text
http://localhost:5178
```

### 文字變亂碼

請確認檔案用 UTF-8 儲存。越文聲調和繁體中文都需要 UTF-8。

### 錄音不能用

請透過 `http://localhost:5178` 開啟網站，並允許瀏覽器麥克風權限。

## 下一步建議

- 新增 7 天南越口音入門路線
- 詞句加入「已會 / 不熟 / 需校對」狀態
- 補真人南越音檔
- 把 RAG 接到後端 embeddings + LLM
- 將 `content.json` 升級成 SQLite
## Desktop Launcher

- Shortcut: `C:\Users\steve\OneDrive\桌面\南越語學習工作台.lnk`
- Script: `launch-app.ps1`
- Behavior: starts `server.mjs` if `http://localhost:5178/` is not already running, then opens the site.
