# 部署指南 📦

## 🚀 準備部署

您的 AI HTML 助手已經配置完成，可以部署到 GitHub Pages！

## 📋 部署檢查清單

### ✅ 已完成的配置：
- [x] 環境變量 API Key 支援
- [x] GitHub Actions 工作流程
- [x] Vite 構建配置
- [x] GitHub Pages 路徑配置

### 🔧 需要手動完成的步驟：

1. **推送到 GitHub**：
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment configuration"
   git push origin main
   ```

2. **設置 Repository Secret**：
   - 前往 https://github.com/jasonliu0101/website-with-gpt-and-html-artifact/settings/secrets/actions
   - 點擊 "New repository secret"
   - Name: `OPENAI_API_KEY`
   - Value: 您的 OpenAI API 密鑰

3. **啟用 GitHub Pages**：
   - 前往 https://github.com/jasonliu0101/website-with-gpt-and-html-artifact/settings/pages
   - Source 選擇: `GitHub Actions`

4. **觸發部署**：
   - 推送代碼後，GitHub Actions 會自動開始構建
   - 查看進度：https://github.com/jasonliu0101/website-with-gpt-and-html-artifact/actions

## 🌐 訪問您的應用

部署完成後，您的應用將在以下地址可用：
**https://jasonliu0101.github.io/website-with-gpt-and-html-artifact/**

## 🔍 故障排除

### 如果部署失敗：
1. 檢查 GitHub Actions 日誌
2. 確認 `OPENAI_API_KEY` secret 已正確設置
3. 確認 Pages 設置為 `GitHub Actions`

### 如果 API Key 不工作：
1. 驗證 OpenAI API Key 的有效性
2. 確認 secret 名稱拼寫正確：`OPENAI_API_KEY`
3. 重新運行 GitHub Actions 工作流程

## 🎯 功能驗證

部署後測試以下功能：
- [ ] 頁面正常載入（應該隱藏 API Key 輸入框）
- [ ] 可以發送消息給 AI
- [ ] AI 響應正常顯示
- [ ] HTML 預覽功能正常
- [ ] 代碼複製功能正常

## 📱 移動設備適配

您的應用已針對移動設備進行優化，在手機和平板上都能正常使用。
