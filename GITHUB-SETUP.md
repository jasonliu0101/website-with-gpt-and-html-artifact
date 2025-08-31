# 🔐 GitH點擊 **"New repository secret"** 按鈕，然後設定：

```
Name: OPENAI_API_KEY
Value: [您的 OpenAI API 密鑰]
```

⚠️ **重要提醒**：
- Secret 名稱必須完全一致：`OPENAI_API_KEY`
- 這是您從 OpenAI 官網獲取的 API 密鑰，格式類似：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`台設定指南

## 🛡️ 安全性說明

### GitHub Secrets 的安全性：
- ✅ **安全**：GitHub Secrets 在構建過程中不會被明文顯示在日誌中
- ✅ **自動遮罩**：即使意外 echo 或 console.log，GitHub 會自動將 secret 內容替換為 `***`
- ✅ **僅構建時可用**：Secrets 只在 GitHub Actions 運行時作為環境變量存在
- ✅ **編譯時嵌入**：Vite 會在構建時將環境變量編譯到最終的 JavaScript 文件中

### 重要提醒：
- 🔒 構建完成的網站文件中，API key 會被編譯進去，但以變量形式存在
- 🔒 任何人都無法在瀏覽器開發者工具中直接看到完整的 API key
- 🔒 GitHub Actions 日誌會自動遮罩 secret 內容

## 必要設定步驟

### 1. 設定 Repository Secret (最重要！)

前往您的 GitHub 倉庫設定頁面：
**https://github.com/jasonliu0101/website-with-gpt-and-html-artifact/settings/secrets/actions**

點擊 **"New repository secret"** 按鈕，然後設定：

```
3. Name: `OPENAI_API_KEY`
Value: [您的 OpenAI API 密鑰]
```

⚠️ **重要提醒**：
- Secret 名稱必須完全一致：`MY_KEY`
- 這是您從 OpenAI 官網獲取的 API 密鑰，格式類似：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. 啟用 GitHub Pages

前往 GitHub Pages 設定頁面：
**https://github.com/jasonliu0101/website-with-gpt-and-html-artifact/settings/pages**

設定：
- **Source**: 選擇 `GitHub Actions`
- **Branch**: 不需要選擇（因為使用 Actions）

### 3. 檢查部署狀態

查看 GitHub Actions 執行狀態：
**https://github.com/jasonliu0101/website-with-gpt-and-html-artifact/actions**

## ✅ 設定完成後

1. **自動部署**：每次推送代碼，GitHub Actions 會自動構建和部署
2. **訪問網站**：https://jasonliu0101.github.io/website-with-gpt-and-html-artifact/
3. **API Key 隱藏**：輸入框已被隱藏，直接使用環境變量中的密鑰

## 🔍 故障排除

### 如果網站無法訪問 OpenAI API：
1. 檢查 `OPENAI_API_KEY` secret 是否正確設定
2. 確認 OpenAI API 密鑰是否有效且有足夠餘額
3. 重新運行 GitHub Actions 工作流程

### 如果部署失敗：
1. 檢查 Actions 頁面的錯誤日誌
2. 確認 Pages 設定為 `GitHub Actions`
3. 確認分支名稱為 `main`

## 📋 設定檢查清單

- [ ] ✅ 已設定 Repository Secret：`OPENAI_API_KEY`
- [ ] ✅ 已啟用 GitHub Pages (Source: GitHub Actions)
- [ ] ✅ GitHub Actions 執行成功
- [ ] ✅ 網站可以正常訪問
- [ ] ✅ AI 功能正常工作

完成這些設定後，您的 AI HTML 助手就可以在 GitHub Pages 上正常運行了！🎉
