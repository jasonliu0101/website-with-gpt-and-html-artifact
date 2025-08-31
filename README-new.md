# AI HTML 助手 🤖✨

這是一個使用 AI 驅動的 HTML 代碼生成工具，支援自然語言描述轉換為完整的 HTML 代碼，具備即時預覽和編輯功能。

## 🌟 功能特色

- 🤖 AI 驅動的 HTML 代碼生成
- 💬 自然語言描述轉換為代碼  
- 🔄 即時預覽與編輯
- 📋 一鍵複製代碼
- ⚡ 支援 JavaScript 互動功能
- 🔄 對話上下文記憶
- 📱 響應式設計

## 🚀 部署到 GitHub Pages

### 設置步驟：

1. **Fork 或克隆此倉庫**
2. **設置 GitHub Secret**：
   - 前往您的 GitHub 倉庫設置
   - 點擊 `Secrets and variables` → `Actions`
   - 添加新的 Repository Secret：
     - Name: `OPENAI_API_KEY`
     - Value: 您的 OpenAI API 密鑰

3. **啟用 GitHub Pages**：
   - 前往倉庫設置中的 `Pages` 選項
   - Source 選擇 `GitHub Actions`

4. **推送代碼**：
   ```bash
   git push origin main
   ```

5. **自動部署**：
   - GitHub Actions 將自動構建和部署
   - 部署完成後，可通過 `https://yourusername.github.io/website-with-gpt-and-html-artifact/` 訪問

## 💻 本地開發

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 構建
npm run build

# 預覽構建結果
npm run preview
```

## 🔧 技術棧

- **前端框架**: Vite + Vanilla JavaScript
- **樣式**: CSS3 with CSS Variables
- **AI 集成**: OpenAI GPT-4o-mini API
- **部署**: GitHub Pages + GitHub Actions
- **流式響應**: Server-Sent Events

## 📝 使用說明

1. **設置 API Key**（如果未在環境變量中配置）
2. **描述需求**：在左側對話框中用自然語言描述您想要的網頁效果
3. **即時預覽**：AI 生成的代碼會自動顯示在右側預覽區域
4. **編輯調整**：可以在 HTML 編輯模式下手動調整代碼
5. **複製使用**：一鍵複製生成的代碼

## 🛡️ 安全性

- API 密鑰通過環境變量安全存儲
- 生產環境不暴露敏感信息
- 支援本地存儲作為回退選項

## 📄 許可證

MIT License
