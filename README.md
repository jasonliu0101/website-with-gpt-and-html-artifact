# AI## 功能特色

- 🤖 **AI 驅動** - 使用 GPT-4o-mini 模型生成高質量 HTML 代碼
- ⚡ **即時串流** - AI 回覆以打字機效果即時顯示，無需等待
- 💬 **自然語言交互** - 用中文描述需求，AI 自動理解並生成代碼
- 🔄 **雙模式切換** - HTML 編輯模式和即時預覽模式一鍵切換
- 📋 **智能複製** - 自動識別代碼塊並提供複製按鈕
- 🎨 **專業樣式** - AI 生成的代碼包含美觀的內聯樣式
- 🔐 **安全存儲** - API Key 本地安全存儲
- 📱 **響應式設計** - 適配各種設備尺寸| AI HTML Assistant

一個結合 ChatGPT 和即時預覽的智能 HTML 代碼生成工具，讓您可以用自然語言描述需求，AI 自動生成對應的 HTML 代碼。

## 功能特色

- 🤖 **AI 驅動** - 使用 GPT-4o-mini 模型生成高質量 HTML 代碼
- 💬 **自然語言交互** - 用中文描述需求，AI 自動理解並生成代碼
- � **雙模式切換** - HTML 編輯模式和即時預覽模式一鍵切換
- 📋 **智能複製** - 自動識別代碼塊並提供複製按鈕
- 🎨 **專業樣式** - AI 生成的代碼包含美觀的內聯樣式
- � **安全存儲** - API Key 本地安全存儲
- 📱 **響應式設計** - 適配各種設備尺寸

## 使用方法

### 1. 設置 API Key
- 在頂部輸入您的 OpenAI API Key
- 點擊「保存」按鈕進行存儲

### 2. AI 對話生成
- 在左側對話框中描述您想要的網頁效果
- 例如：「創建一個登入表單」、「設計一個產品卡片」
- AI 會自動生成對應的 HTML 代碼

### 3. 代碼預覽
- 使用右上角的「HTML 編輯」和「預覽效果」按鈕切換模式
- 在預覽模式下可即時看到渲染效果
- 使用「複製代碼」按鈕快速複製生成的代碼

## 技術規格

- **AI 模型**: GPT-4o-mini
- **API**: OpenAI Chat Completions API (支援串流)
- **串流技術**: Server-Sent Events (SSE)
- **前端**: Vanilla JavaScript + Vite
- **樣式**: 現代 CSS3 + CSS 變數 + 動畫效果

## 開發設置

### 環境要求
- Node.js (版本 14 或更高)
- OpenAI API Key

### 安裝依賴
\`\`\`bash
npm install
\`\`\`

### 本地開發
\`\`\`bash
npm run dev
\`\`\`

應用程式將在 `http://localhost:5173/` 啟動

### 構建生產版本
\`\`\`bash
npm run build
\`\`\`

## 使用範例

### 輸入範例
```
創建一個現代化的登入頁面，包含：
- 用戶名和密碼輸入框
- 記住我選項
- 登入按鈕
- 使用漸層背景和陰影效果
```

### AI 會生成
- 完整的 HTML 結構
- 美觀的 CSS 樣式
- 響應式設計
- 互動效果

## 項目結構

\`\`\`
ai-html-assistant/
├── src/
│   ├── main.js          # 主要應用邏輯和 AI 集成
│   └── style.css        # 應用樣式
├── index.html           # 主頁面結構
├── package.json         # 項目配置
└── README.md           # 說明文件
\`\`\`

## API 使用說明

本應用使用 OpenAI 的 Chat Completions API：
- 模型：gpt-4o-mini
- 最大 tokens：2000
- 溫度：0.7

## 瀏覽器支援

- Chrome (推薦)
- Firefox
- Safari
- Edge

## 隱私與安全

- API Key 僅存儲在本地瀏覽器中
- 不會上傳或共享您的 API Key
- 所有 AI 交互通過 HTTPS 加密

## 授權

MIT License
