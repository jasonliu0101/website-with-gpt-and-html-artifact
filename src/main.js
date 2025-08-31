import './style.css'

class AIHTMLAssistant {
  constructor() {
    // 優先使用環境變量中的 API key，回退到 localStorage
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem('openai-api-key') || '';
    this.currentMode = 'html'; // 'html' or 'preview'
    this.conversationHistory = []; // 對話歷史
    
    // DOM 元素
    this.apiKeyInput = document.getElementById('apiKeyInput');
    this.saveKeyBtn = document.getElementById('saveKeyBtn');
    this.chatMessages = document.getElementById('chatMessages');
    this.chatInput = document.getElementById('chatInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.clearChatBtn = document.getElementById('clearChatBtn');
    this.htmlModeBtn = document.getElementById('htmlModeBtn');
    this.previewModeBtn = document.getElementById('previewModeBtn');
    this.htmlInput = document.getElementById('htmlInput');
    this.preview = document.getElementById('preview');
    this.copyCodeBtn = document.getElementById('copyCodeBtn');
    this.htmlMode = document.getElementById('htmlMode');
    this.previewMode = document.getElementById('previewMode');
    
    this.init();
  }

  init() {
    // 載入已保存的 API Key
    if (this.apiKey) {
      this.apiKeyInput.value = this.apiKey;
    }
    
    // 直接隱藏 API key 輸入區域（用於生產部署）
    const apiKeySection = document.querySelector('.api-key-section');
    if (apiKeySection) {
      apiKeySection.style.display = 'none';
    }

    // 事件監聽器
    this.saveKeyBtn.addEventListener('click', () => this.saveApiKey());
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.clearChatBtn.addEventListener('click', () => this.clearChat());
    this.copyCodeBtn.addEventListener('click', () => this.copyCode());
    
    this.htmlModeBtn.addEventListener('click', () => this.switchMode('html'));
    this.previewModeBtn.addEventListener('click', () => this.switchMode('preview'));
    
    // Enter 鍵發送消息
    this.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // HTML 輸入變化時更新預覽
    this.htmlInput.addEventListener('input', () => {
      if (this.currentMode === 'preview') {
        this.updatePreview();
      }
    });

    // Tab 縮進支援
    this.htmlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.htmlInput.selectionStart;
        const end = this.htmlInput.selectionEnd;
        
        this.htmlInput.value = 
          this.htmlInput.value.substring(0, start) + 
          '  ' + 
          this.htmlInput.value.substring(end);
        
        this.htmlInput.selectionStart = this.htmlInput.selectionEnd = start + 2;
      }
    });

    // 初始歡迎消息，10秒後自動消失
    const welcomeId = this.addMessage('system', '歡迎使用 AI HTML 助手！請先設置您的 OpenAI API Key，然後描述您想要的網頁效果。');
    setTimeout(() => {
      const welcomeElement = document.getElementById(welcomeId);
      if (welcomeElement) {
        welcomeElement.remove();
      }
    }, 10000);
    
    // 設置默認 HTML
    this.setDefaultHTML();
  }

  saveApiKey() {
    const key = this.apiKeyInput.value.trim();
    if (key) {
      this.apiKey = key;
      localStorage.setItem('openai-api-key', key);
      
      // 顯示成功消息，3秒後自動消失
      const messageId = this.addMessage('system', 'API Key 已保存！');
      setTimeout(() => {
        const messageElement = document.getElementById(messageId);
        if (messageElement) {
          messageElement.remove();
        }
      }, 3000);
    } else {
      alert('請輸入有效的 API Key');
    }
  }

  async sendMessage() {
    const message = this.chatInput.value.trim();
    if (!message) return;
    
    if (!this.apiKey) {
      alert('請先設置 OpenAI API Key');
      return;
    }

    // 添加用戶消息
    this.addMessage('user', message);
    
    // 清空輸入框
    this.chatInput.value = '';
    
    // 創建 AI 回應消息容器（不顯示載入狀態）
    const responseId = this.addMessage('assistant', '', false, true);
    
    try {
      const fullContent = await this.streamOpenAI(message, responseId);
      
      // 串流完成後，使用完整內容重新格式化
      const responseElement = document.getElementById(responseId);
      if (responseElement && fullContent) {
        // 使用存儲的完整內容
        const completeContent = responseElement.dataset.fullContent || fullContent;
        
        // 重新格式化並更新
        this.updateMessageContent(responseId, completeContent);
        // 提取 HTML 代碼到編輯器
        this.extractAndSetHTML(completeContent);
      }
      
    } catch (error) {
      console.error('API 調用錯誤:', error);
      this.updateMessageContent(responseId, '抱歉，發生了錯誤：' + error.message);
    }
  }

  async streamOpenAI(message, messageId) {
    // 將用戶消息添加到對話歷史
    this.conversationHistory.push({
      role: 'user',
      content: message
    });

    // 限制對話歷史長度，保持最近的 10 輪對話（20 條消息）
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }

    // 準備消息數組，包含系統消息和對話歷史
    const messages = [
      {
        role: 'system',
        content: '你是一個專業的 HTML/CSS/JavaScript 開發助手。請根據用戶的需求生成完整、美觀且功能性的 HTML 代碼。代碼應該包含內聯 CSS 樣式，確保在獨立 HTML 文件中能正常顯示。請用中文回應，並在回應中包含完整的 HTML 代碼。請記住之前的對話內容，保持上下文連貫性。'
      },
      ...this.conversationHistory // 展開整個對話歷史
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 2000,
        temperature: 0.7,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';
    
    // 在消息元素上存儲完整內容，用於串流完成後處理
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
      messageElement.dataset.fullContent = '';
    }
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // 保留最後一個不完整的行
        
        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              // 串流完成，存儲最終內容
              if (messageElement) {
                messageElement.dataset.fullContent = fullContent;
              }
              return fullContent;
            }
            
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              
              if (delta) {
                fullContent += delta;
                // 更新存儲的完整內容
                if (messageElement) {
                  messageElement.dataset.fullContent = fullContent;
                }
                // 即時更新顯示內容
                this.updateStreamingMessage(messageId, fullContent);
              }
            } catch (e) {
              // 忽略解析錯誤
              console.warn('JSON 解析錯誤:', e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
      
      // 將 AI 的完整回應添加到對話歷史
      if (fullContent) {
        this.conversationHistory.push({
          role: 'assistant',
          content: fullContent
        });
      }
    }
    
    return fullContent;
  }

  addMessage(role, content, isLoading = false, isStreaming = false) {
    const messageDiv = document.createElement('div');
    const messageId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    messageDiv.id = messageId;
    messageDiv.className = `message ${role}`;
    
    if (isLoading) {
      messageDiv.innerHTML = '<div class="loading">正在生成回應...</div>';
    } else if (isStreaming) {
      // 串流消息，初始為空但有光標效果
      messageDiv.innerHTML = '<span class="streaming-cursor">▋</span>';
    } else {
      messageDiv.innerHTML = this.formatMessage(content);
    }
    
    this.chatMessages.appendChild(messageDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    
    return messageId;
  }

  updateStreamingMessage(messageId, content) {
    const messageDiv = document.getElementById(messageId);
    if (!messageDiv) return;
    
    // 檢查是否有代碼塊標記
    const hasCodeStart = content.includes('```html');
    const hasCompleteCodeBlock = /```html\n[\s\S]*?\n```/.test(content);
    
    // 如果是第一次檢測到代碼塊開始，建立DOM結構
    if (hasCodeStart && !messageDiv.dataset.hasCodeStructure) {
      const parts = content.split('```html');
      const textBeforeCode = parts[0];
      
      // 建立固定的DOM結構
      messageDiv.innerHTML = `
        <div class="message-text">${textBeforeCode.replace(/\n/g, '<br>')}</div>
        <div class="streaming-code-block" id="code-block-${messageId}">
          <div class="code-header">
            <span class="code-status">HTML 代碼（生成中...）</span>
          </div>
          <div class="code-content" id="code-content-${messageId}"></div>
        </div>
      `;
      
      messageDiv.dataset.hasCodeStructure = 'true';
    }
    
    // 更新代碼內容
    if (hasCodeStart) {
      const codeContentDiv = document.getElementById(`code-content-${messageId}`);
      const codeStatusSpan = messageDiv.querySelector('.code-status');
      const codeBlockDiv = document.getElementById(`code-block-${messageId}`);
      
      if (codeContentDiv && codeStatusSpan && codeBlockDiv) {
        // 提取代碼內容
        const codeMatch = content.match(/```html\n([\s\S]*?)(?:\n```|$)/);
        if (codeMatch) {
          const codeContent = codeMatch[1];
          
          if (hasCompleteCodeBlock) {
            // 代碼塊完成，轉換為最終狀態
            const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
            codeBlockDiv.className = 'code-block';
            codeStatusSpan.textContent = 'HTML 代碼';
            codeContentDiv.id = codeId;
            codeContentDiv.innerHTML = this.escapeHtml(codeContent);
            
            // 添加複製按鈕
            const header = codeBlockDiv.querySelector('.code-header');
            if (!header.querySelector('.copy-code-btn')) {
              header.innerHTML = `
                <span>HTML 代碼</span>
                <button class="copy-code-btn" onclick="window.copyCodeBlock('${codeId}')">複製</button>
              `;
            }
            
            // 自動提取到編輯器
            this.htmlInput.value = codeContent;
            if (this.currentMode === 'preview') {
              this.updatePreview();
            }
          } else {
            // 代碼還在生成中
            codeContentDiv.innerHTML = this.escapeHtml(codeContent) + '<span class="streaming-cursor">▋</span>';
          }
        }
      }
    } else {
      // 沒有代碼塊，正常顯示
      if (!messageDiv.dataset.hasCodeStructure) {
        messageDiv.innerHTML = content.replace(/\n/g, '<br>') + '<span class="streaming-cursor">▋</span>';
      }
    }
    
    // 自動滾動到底部
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  updateMessageContent(messageId, content) {
    const messageDiv = document.getElementById(messageId);
    if (!messageDiv) return;
    
    // 移除光標並顯示最終格式化內容
    messageDiv.innerHTML = this.formatMessage(content);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  formatStreamingContent(content) {
    // 串流期間的格式化
    let formattedContent = content;
    
    // 檢查是否有未完成的代碼塊開始標記
    const hasIncompleteCodeStart = content.includes('```html') && !content.includes('\n```');
    
    if (hasIncompleteCodeStart) {
      // 如果有未完成的代碼塊，進行特殊處理
      const parts = content.split('```html');
      if (parts.length > 1) {
        const beforeCode = parts[0];
        const codeContent = parts[1];
        
        // 前面的文字正常格式化
        const formattedBefore = beforeCode.replace(/\n/g, '<br>');
        
        // 代碼部分用特殊樣式顯示
        formattedContent = formattedBefore + 
          '<div class="streaming-code-block">' +
          '<div class="code-header"><span>HTML 代碼（生成中...）</span></div>' +
          '<div class="code-content">' + this.escapeHtml(codeContent) + '</div>' +
          '</div>';
        
        return formattedContent;
      }
    }
    
    // 一般內容的換行處理
    return content.replace(/\n/g, '<br>');
  }

  formatMessage(content) {
    // 檢查是否包含代碼塊
    const codeRegex = /```html\n([\s\S]*?)\n```/g;
    let formattedContent = content;
    
    formattedContent = formattedContent.replace(codeRegex, (match, code) => {
      const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
      return `
        <div class="code-block">
          <div class="code-header">
            <span>HTML 代碼</span>
            <button class="copy-code-btn" onclick="window.copyCodeBlock('${codeId}')">複製</button>
          </div>
          <div class="code-content" id="${codeId}">${this.escapeHtml(code)}</div>
        </div>
      `;
    });
    
    // 將換行轉換為 <br>
    formattedContent = formattedContent.replace(/\n/g, '<br>');
    
    return formattedContent;
  }

  extractAndSetHTML(content) {
    const codeRegex = /```html\n([\s\S]*?)\n```/g;
    const match = codeRegex.exec(content);
    
    if (match && match[1]) {
      this.htmlInput.value = match[1].trim();
      if (this.currentMode === 'preview') {
        this.updatePreview();
      }
    }
  }

  extractAndSetHTMLFromFormatted(htmlContent) {
    // 從格式化的 HTML 內容中提取代碼
    const codeElements = document.querySelectorAll('.code-content');
    if (codeElements.length > 0) {
      // 取最後一個代碼塊（最新的）
      const lastCodeElement = codeElements[codeElements.length - 1];
      const code = lastCodeElement.textContent;
      this.htmlInput.value = code;
      if (this.currentMode === 'preview') {
        this.updatePreview();
      }
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  clearChat() {
    this.chatMessages.innerHTML = '';
    this.conversationHistory = []; // 清空對話歷史
    this.addMessage('system', '對話已清空。有什麼可以幫助您的嗎？');
  }

  switchMode(mode) {
    this.currentMode = mode;
    
    if (mode === 'html') {
      this.htmlModeBtn.classList.add('active');
      this.previewModeBtn.classList.remove('active');
      this.htmlMode.classList.remove('hidden');
      this.previewMode.classList.add('hidden');
    } else {
      this.htmlModeBtn.classList.remove('active');
      this.previewModeBtn.classList.add('active');
      this.htmlMode.classList.add('hidden');
      this.previewMode.classList.remove('hidden');
      this.updatePreview();
    }
  }

  updatePreview() {
    const htmlContent = this.htmlInput.value;
    
    // 創建完整的 HTML 文檔
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="zh-TW">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>預覽</title>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
    
    // 更新 iframe 內容
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // 移除 sandbox 限制以允許 alert 等功能
    this.preview.removeAttribute('sandbox');
    this.preview.src = url;
    
    // 清理舊的 URL
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async copyCode() {
    try {
      await navigator.clipboard.writeText(this.htmlInput.value);
      
      // 顯示複製成功反饋
      const originalText = this.copyCodeBtn.textContent;
      this.copyCodeBtn.textContent = '已複製!';
      this.copyCodeBtn.style.backgroundColor = '#22c55e';
      
      setTimeout(() => {
        this.copyCodeBtn.textContent = originalText;
        this.copyCodeBtn.style.backgroundColor = '';
      }, 1500);
      
    } catch (err) {
      console.error('複製失敗:', err);
      alert('複製失敗，請手動選擇並複製代碼');
    }
  }

  setDefaultHTML() {
    const defaultHTML = `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #333; text-align: center;">歡迎使用 AI HTML 助手！</h1>
  
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin: 20px 0;">
    <h2>✨ 功能特色</h2>
    <ul style="line-height: 1.6;">
      <li>🤖 AI 驅動的 HTML 代碼生成</li>
      <li>💬 自然語言描述轉換為代碼</li>
      <li>🔄 即時預覽與編輯</li>
      <li>📋 一鍵複製代碼</li>
      <li>⚡ 支援 JavaScript 互動功能</li>
    </ul>
  </div>
  
  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
    <h3 style="color: #007bff; margin-top: 0;">💡 使用提示</h3>
    <p>在左側對話框中描述您想要的網頁效果，例如：</p>
    <ul>
      <li>"創建一個登入表單，包含用戶名和密碼欄位"</li>
      <li>"設計一個產品展示卡片，有圖片和說明"</li>
      <li>"製作一個響應式的導航選單"</li>
    </ul>
  </div>
  
  <div style="text-align: center; margin-top: 20px;">
    <button onclick="alert('🎉 JavaScript 功能正常運作！預覽模式支援完整的互動功能。')" 
            style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">
      測試 JavaScript 功能
    </button>
  </div>
</div>`;

    this.htmlInput.value = defaultHTML;
  }
}

// 全域函數供 HTML 中的按鈕使用
window.copyCodeBlock = function(codeId) {
  const codeElement = document.getElementById(codeId);
  if (codeElement) {
    const code = codeElement.textContent;
    navigator.clipboard.writeText(code).then(() => {
      const btn = codeElement.parentElement.querySelector('.copy-code-btn');
      const originalText = btn.textContent;
      btn.textContent = '已複製!';
      btn.style.backgroundColor = '#22c55e';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
      }, 1500);
    });
  }
};

// 初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
  new AIHTMLAssistant();
});
