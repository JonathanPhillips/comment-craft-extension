// Content script for Comment Craft extension
// Runs on social media sites to detect comments and inject AI response functionality

class CommentCraft {
  constructor() {
    console.log('Comment Craft: Constructor called');
    this.selectedComment = null;
    this.responsePanel = null;
    this.init();
  }

  init() {
    console.log('Comment Craft: Initializing...');
    this.createStyles();
    this.observeDOM();
    this.setupEventListeners();
    console.log('Comment Craft: Initialization complete');
  }

  createStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .comment-craft-highlight {
        outline: 2px solid #4285f4 !important;
        outline-offset: 2px !important;
        border-radius: 4px !important;
      }
      
      .comment-craft-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        border: 2px solid rgba(255, 255, 255, 0.3) !important;
        padding: 6px 12px !important;
        border-radius: 16px !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        margin: 4px 8px !important;
        opacity: 0.95 !important;
        transition: all 0.2s ease !important;
        z-index: 9999 !important;
        position: relative !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
        box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3) !important;
      }
      
      .comment-craft-button:hover {
        opacity: 1 !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6) !important;
        border-color: rgba(255, 255, 255, 0.5) !important;
        background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%) !important;
      }
      
      .comment-craft-panel {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        background: white !important;
        border-radius: 12px !important;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
        padding: 24px !important;
        z-index: 10000 !important;
        width: 400px !important;
        max-width: 90vw !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
      
      .comment-craft-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0, 0, 0, 0.5) !important;
        z-index: 9999 !important;
      }
      
      .comment-craft-close {
        position: absolute !important;
        top: 12px !important;
        right: 12px !important;
        background: none !important;
        border: none !important;
        font-size: 18px !important;
        cursor: pointer !important;
        color: #666 !important;
      }
      
      .comment-craft-original {
        background: #f5f5f5 !important;
        padding: 12px !important;
        border-radius: 8px !important;
        margin-bottom: 16px !important;
        font-size: 13px !important;
        color: #333 !important;
        max-height: 100px !important;
        overflow-y: auto !important;
      }
      
      .comment-craft-response-types {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 8px !important;
        margin-bottom: 16px !important;
      }
      
      .comment-craft-response-type {
        padding: 8px 12px !important;
        border: 2px solid #e0e0e0 !important;
        border-radius: 8px !important;
        background: white !important;
        cursor: pointer !important;
        font-size: 12px !important;
        text-align: center !important;
        transition: all 0.2s ease !important;
      }
      
      .comment-craft-response-type.selected {
        border-color: #4285f4 !important;
        background: #f0f4ff !important;
        color: #4285f4 !important;
      }
      
      .comment-craft-custom-prompt {
        width: 100% !important;
        padding: 12px !important;
        border: 2px solid #e0e0e0 !important;
        border-radius: 8px !important;
        font-size: 13px !important;
        margin-bottom: 16px !important;
        font-family: inherit !important;
        resize: vertical !important;
        min-height: 60px !important;
      }
      
      .comment-craft-generate {
        width: 100% !important;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        border: none !important;
        padding: 12px !important;
        border-radius: 8px !important;
        font-weight: 500 !important;
        cursor: pointer !important;
        margin-bottom: 16px !important;
      }
      
      .comment-craft-result {
        background: #f9f9f9 !important;
        padding: 12px !important;
        border-radius: 8px !important;
        margin-bottom: 16px !important;
        font-size: 13px !important;
        color: #333 !important;
        min-height: 40px !important;
        border: 1px solid #e0e0e0 !important;
      }
      
      .comment-craft-actions {
        display: flex !important;
        gap: 8px !important;
      }
      
      .comment-craft-copy, .comment-craft-use {
        flex: 1 !important;
        padding: 8px 16px !important;
        border: 1px solid #4285f4 !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        font-size: 12px !important;
      }
      
      .comment-craft-copy {
        background: white !important;
        color: #4285f4 !important;
      }
      
      .comment-craft-use {
        background: #4285f4 !important;
        color: white !important;
      }
    `;
    document.head.appendChild(style);
  }

  observeDOM() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            this.processNewContent(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Process existing content
    this.processNewContent(document.body);
  }

  processNewContent(container) {
    // Site-specific comment selectors
    const commentSelectors = {
      'youtube.com': [
        '#content-text', // YouTube comments
        'yt-formatted-string#content-text'
      ],
      'reddit.com': [
        '[data-testid="comment"]',
        '.Comment',
        'div[data-click-id="text"]'
      ],
      'twitter.com': [
        '[data-testid="tweetText"]',
        '[data-testid="tweet"]'
      ],
      'x.com': [
        '[data-testid="tweetText"]',
        '[data-testid="tweet"]'
      ],
      'instagram.com': [
        'article span',
        '[role="button"] span'
      ],
      'tiktok.com': [
        '[data-e2e="comment-item-content"]',
        '[data-e2e="browse-video-desc"]'
      ],
      'facebook.com': [
        '[data-ad-preview="message"]',
        '[role="article"] span'
      ]
    };

    const hostname = window.location.hostname;
    const site = Object.keys(commentSelectors).find(site => hostname.includes(site));
    
    if (!site) return;

    commentSelectors[site].forEach(selector => {
      const comments = container.querySelectorAll(selector);
      comments.forEach(comment => {
        if (!comment.querySelector('.comment-craft-button') && comment.textContent.trim()) {
          this.addResponseButton(comment);
        }
      });
    });
  }

  addResponseButton(commentElement) {
    const button = document.createElement('button');
    button.className = 'comment-craft-button';
    button.textContent = '✨ Craft Response';
    button.title = 'Generate AI response to this comment';
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Comment Craft: Button clicked', commentElement);
      this.showResponsePanel(commentElement);
    });

    // Find the best place to insert the button
    const insertionPoint = this.findInsertionPoint(commentElement);
    if (insertionPoint) {
      insertionPoint.appendChild(button);
    }
  }

  findInsertionPoint(commentElement) {
    // Try to find action buttons area or create one
    const hostname = window.location.hostname;
    
    if (hostname.includes('youtube.com')) {
      const toolbar = commentElement.closest('#comment')?.querySelector('#toolbar');
      return toolbar;
    } else if (hostname.includes('reddit.com')) {
      const buttons = commentElement.closest('[data-testid="comment"]')?.querySelector('[role="group"]');
      return buttons;
    } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      const actions = commentElement.closest('[role="group"]');
      return actions;
    }
    
    // Fallback: append to comment element
    return commentElement;
  }

  showResponsePanel(commentElement) {
    console.log('Comment Craft: Showing response panel for:', commentElement.textContent.trim());
    this.selectedComment = commentElement;
    const commentText = commentElement.textContent.trim();
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'comment-craft-overlay';
    overlay.addEventListener('click', () => this.closePanel());
    
    // Create panel
    const panel = document.createElement('div');
    panel.className = 'comment-craft-panel';
    panel.innerHTML = `
      <button class="comment-craft-close">×</button>
      <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #333;">Craft Your Response</h3>
      
      <div class="comment-craft-original">
        <strong>Original comment:</strong><br>
        ${commentText}
      </div>
      
      <div class="comment-craft-response-types">
        <div class="comment-craft-response-type" data-type="funny">😄 Funny</div>
        <div class="comment-craft-response-type" data-type="clapback">🔥 Clapback</div>
        <div class="comment-craft-response-type" data-type="factcheck">📋 Fact Check</div>
        <div class="comment-craft-response-type" data-type="deescalate">🕊️ De-escalate</div>
        <div class="comment-craft-response-type" data-type="supportive">💙 Supportive</div>
        <div class="comment-craft-response-type selected" data-type="custom">✏️ Custom</div>
      </div>
      
      <textarea class="comment-craft-custom-prompt" placeholder="Describe how you want to respond..."></textarea>
      
      <button class="comment-craft-generate">Generate Response</button>
      
      <div class="comment-craft-result" style="display: none;">
        <div class="result-text"></div>
        <div class="comment-craft-actions">
          <button class="comment-craft-copy">Copy</button>
          <button class="comment-craft-use">Use Response</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(panel);
    
    this.responsePanel = panel;
    this.setupPanelEventListeners();
  }

  setupPanelEventListeners() {
    const panel = this.responsePanel;
    
    // Close button
    panel.querySelector('.comment-craft-close').addEventListener('click', () => {
      this.closePanel();
    });
    
    // Response type selection
    panel.querySelectorAll('.comment-craft-response-type').forEach(button => {
      button.addEventListener('click', () => {
        panel.querySelectorAll('.comment-craft-response-type').forEach(b => b.classList.remove('selected'));
        button.classList.add('selected');
        
        const customPrompt = panel.querySelector('.comment-craft-custom-prompt');
        customPrompt.style.display = button.dataset.type === 'custom' ? 'block' : 'none';
      });
    });
    
    // Generate button
    panel.querySelector('.comment-craft-generate').addEventListener('click', () => {
      this.generateResponse();
    });
    
    // Copy button
    panel.querySelector('.comment-craft-copy').addEventListener('click', () => {
      const responseText = panel.querySelector('.result-text').textContent;
      navigator.clipboard.writeText(responseText);
    });
    
    // Use response button
    panel.querySelector('.comment-craft-use').addEventListener('click', () => {
      const responseText = panel.querySelector('.result-text').textContent;
      this.insertResponse(responseText);
      this.closePanel();
    });
  }

  async generateResponse() {
    const panel = this.responsePanel;
    const selectedType = panel.querySelector('.comment-craft-response-type.selected');
    const responseType = selectedType.dataset.type;
    const customPrompt = panel.querySelector('.comment-craft-custom-prompt').value;
    const originalComment = this.selectedComment.textContent.trim();
    
    const generateButton = panel.querySelector('.comment-craft-generate');
    generateButton.textContent = 'Generating...';
    generateButton.disabled = true;
    
    try {
      // Get settings for LLM provider
      const settings = await chrome.storage.sync.get(['defaultProvider']);
      const llmProvider = settings.defaultProvider || 'openai';
      
      const response = await chrome.runtime.sendMessage({
        action: 'generateResponse',
        data: {
          originalComment,
          responseType,
          prompt: customPrompt,
          llmProvider
        }
      });
      
      if (response.success) {
        const resultDiv = panel.querySelector('.comment-craft-result');
        const resultText = panel.querySelector('.result-text');
        resultText.textContent = response.response;
        resultDiv.style.display = 'block';
      } else {
        alert('Error generating response: ' + response.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      generateButton.textContent = 'Generate Response';
      generateButton.disabled = false;
    }
  }

  insertResponse(responseText) {
    // Find comment input field based on current site
    const hostname = window.location.hostname;
    let inputField = null;
    
    if (hostname.includes('youtube.com')) {
      inputField = document.querySelector('#placeholder-area');
    } else if (hostname.includes('reddit.com')) {
      inputField = document.querySelector('[data-testid="comment-submission-form-richtext"]');
    } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      inputField = document.querySelector('[data-testid="tweetTextarea_0"]');
    }
    
    if (inputField) {
      inputField.focus();
      inputField.textContent = responseText;
      
      // Trigger input event to notify the site
      inputField.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(responseText);
      alert('Response copied to clipboard!');
    }
  }

  closePanel() {
    const overlay = document.querySelector('.comment-craft-overlay');
    const panel = document.querySelector('.comment-craft-panel');
    
    if (overlay) overlay.remove();
    if (panel) panel.remove();
    
    this.responsePanel = null;
    this.selectedComment = null;
  }

  setupEventListeners() {
    // Keyboard shortcut (Ctrl/Cmd + Shift + C)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const selectedElement = selection.getRangeAt(0).commonAncestorContainer;
          const commentElement = selectedElement.nodeType === 3 ? 
            selectedElement.parentElement : selectedElement;
          
          if (commentElement.textContent.trim()) {
            this.showResponsePanel(commentElement);
          }
        }
      }
    });
  }
}

// Initialize when DOM is ready with error handling
console.log('Comment Craft: Content script loading...');

function initializeExtension() {
  try {
    console.log('Comment Craft: Attempting to initialize...');
    new CommentCraft();
    console.log('Comment Craft: Successfully initialized');
  } catch (error) {
    console.error('Comment Craft: Initialization failed:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Comment Craft: DOM loaded, initializing...');
    initializeExtension();
  });
} else {
  console.log('Comment Craft: DOM already ready, initializing...');
  initializeExtension();
}