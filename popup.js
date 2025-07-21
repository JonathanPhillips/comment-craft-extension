// Popup script for Comment Craft extension

document.addEventListener('DOMContentLoaded', async () => {
  await initializePopup();
});

async function initializePopup() {
  // Load stored settings
  const settings = await chrome.storage.sync.get([
    'openaiKey', 'anthropicKey', 'googleKey', 
    'defaultProvider', 'responsesGenerated'
  ]);
  
  // Update status indicator
  updateStatus(settings);
  
  // Set default provider dropdown
  const providerSelect = document.getElementById('llmProvider');
  providerSelect.value = settings.defaultProvider || 'openai';
  
  // Update stats
  document.getElementById('responsesGenerated').textContent = settings.responsesGenerated || 0;
  
  // Setup event listeners
  setupEventListeners();
}

function updateStatus(settings) {
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  
  const hasOpenAI = !!settings.openaiKey;
  const hasAnthropic = !!settings.anthropicKey;
  const hasGoogle = !!settings.googleKey;
  
  const configuredCount = [hasOpenAI, hasAnthropic, hasGoogle].filter(Boolean).length;
  
  if (configuredCount === 0) {
    statusIndicator.className = 'status-indicator';
    statusText.textContent = 'No API keys configured';
  } else if (configuredCount < 3) {
    statusIndicator.className = 'status-indicator partial';
    statusText.textContent = `${configuredCount}/3 providers configured`;
  } else {
    statusIndicator.className = 'status-indicator configured';
    statusText.textContent = 'All providers configured';
  }
}

function setupEventListeners() {
  // Provider selection
  document.getElementById('llmProvider').addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ defaultProvider: e.target.value });
  });
  
  // Settings button
  document.getElementById('settingsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  
  // Help button
  document.getElementById('helpBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://github.com/your-username/comment-craft-extension' });
  });
  
  // Footer links
  document.getElementById('githubLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://github.com/your-username/comment-craft-extension' });
  });
  
  document.getElementById('rateLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://addons.mozilla.org/en-US/firefox/addon/comment-craft/' });
  });
  
  document.getElementById('reportBugLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://github.com/your-username/comment-craft-extension/issues' });
  });
}