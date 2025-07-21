// Options page script for Comment Craft extension

document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  setupEventListeners();
});

async function loadSettings() {
  try {
    const settings = await chrome.storage.sync.get([
      'openaiKey', 'anthropicKey', 'googleKey',
      'defaultProvider', 'autoInsert', 'showKeyboardShortcuts',
      'responseLength', 'responseTone', 'saveHistory', 'anonymizeData'
    ]);

    // Load API keys
    if (settings.openaiKey) {
      document.getElementById('openaiKey').value = settings.openaiKey;
      updateProviderStatus('openai', true);
    }
    if (settings.anthropicKey) {
      document.getElementById('anthropicKey').value = settings.anthropicKey;
      updateProviderStatus('anthropic', true);
    }
    if (settings.googleKey) {
      document.getElementById('googleKey').value = settings.googleKey;
      updateProviderStatus('google', true);
    }

    // Load other settings
    document.getElementById('defaultProvider').value = settings.defaultProvider || 'openai';
    document.getElementById('autoInsert').checked = settings.autoInsert || false;
    document.getElementById('showKeyboardShortcuts').checked = settings.showKeyboardShortcuts !== false;
    document.getElementById('responseLength').value = settings.responseLength || 'medium';
    document.getElementById('responseTone').value = settings.responseTone || 'casual';
    document.getElementById('saveHistory').checked = settings.saveHistory || false;
    document.getElementById('anonymizeData').checked = settings.anonymizeData !== false;

  } catch (error) {
    console.error('Error loading settings:', error);
    showNotification('Error loading settings', 'error');
  }
}

function setupEventListeners() {
  // API key inputs
  document.getElementById('openaiKey').addEventListener('input', debounce(() => saveApiKey('openai'), 1000));
  document.getElementById('anthropicKey').addEventListener('input', debounce(() => saveApiKey('anthropic'), 1000));
  document.getElementById('googleKey').addEventListener('input', debounce(() => saveApiKey('google'), 1000));

  // Settings inputs
  document.getElementById('defaultProvider').addEventListener('change', saveSetting);
  document.getElementById('autoInsert').addEventListener('change', saveSetting);
  document.getElementById('showKeyboardShortcuts').addEventListener('change', saveSetting);
  document.getElementById('responseLength').addEventListener('change', saveSetting);
  document.getElementById('responseTone').addEventListener('change', saveSetting);
  document.getElementById('saveHistory').addEventListener('change', saveSetting);
  document.getElementById('anonymizeData').addEventListener('change', saveSetting);

  // Visibility toggles
  document.querySelectorAll('.toggle-visibility').forEach(button => {
    button.addEventListener('click', togglePasswordVisibility);
  });

  // Action buttons
  document.getElementById('saveSettings').addEventListener('click', saveAllSettings);
  document.getElementById('resetSettings').addEventListener('click', resetSettings);
  document.getElementById('testConnection').addEventListener('click', testConnections);

  // Footer links
  document.getElementById('viewLogs').addEventListener('click', viewLogs);
  document.getElementById('exportSettings').addEventListener('click', exportSettings);
  document.getElementById('importSettings').addEventListener('click', importSettings);

  // Modal
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('testModal').addEventListener('click', (e) => {
    if (e.target.id === 'testModal') closeModal();
  });
}

async function saveApiKey(provider) {
  const input = document.getElementById(`${provider}Key`);
  const key = input.value.trim();
  
  try {
    if (key) {
      await chrome.storage.sync.set({ [`${provider}Key`]: key });
      updateProviderStatus(provider, true);
    } else {
      await chrome.storage.sync.remove([`${provider}Key`]);
      updateProviderStatus(provider, false);
    }
  } catch (error) {
    console.error(`Error saving ${provider} key:`, error);
    showNotification(`Error saving ${provider} API key`, 'error');
  }
}

async function saveSetting(event) {
  const { id, type, checked, value } = event.target;
  const settingValue = type === 'checkbox' ? checked : value;
  
  try {
    await chrome.storage.sync.set({ [id]: settingValue });
    showNotification('Setting saved', 'success');
  } catch (error) {
    console.error('Error saving setting:', error);
    showNotification('Error saving setting', 'error');
  }
}

async function saveAllSettings() {
  const button = document.getElementById('saveSettings');
  const originalText = button.textContent;
  button.textContent = 'Saving...';
  button.disabled = true;
  
  try {
    const settings = {
      openaiKey: document.getElementById('openaiKey').value.trim(),
      anthropicKey: document.getElementById('anthropicKey').value.trim(),
      googleKey: document.getElementById('googleKey').value.trim(),
      defaultProvider: document.getElementById('defaultProvider').value,
      autoInsert: document.getElementById('autoInsert').checked,
      showKeyboardShortcuts: document.getElementById('showKeyboardShortcuts').checked,
      responseLength: document.getElementById('responseLength').value,
      responseTone: document.getElementById('responseTone').value,
      saveHistory: document.getElementById('saveHistory').checked,
      anonymizeData: document.getElementById('anonymizeData').checked
    };

    // Remove empty API keys
    Object.keys(settings).forEach(key => {
      if (key.endsWith('Key') && !settings[key]) {
        delete settings[key];
      }
    });

    await chrome.storage.sync.set(settings);
    showNotification('All settings saved successfully!', 'success');
    
    // Update provider status indicators
    updateProviderStatus('openai', !!settings.openaiKey);
    updateProviderStatus('anthropic', !!settings.anthropicKey);
    updateProviderStatus('google', !!settings.googleKey);
    
  } catch (error) {
    console.error('Error saving settings:', error);
    showNotification('Error saving settings', 'error');
  } finally {
    button.textContent = originalText;
    button.disabled = false;
  }
}

async function resetSettings() {
  if (!confirm('Are you sure you want to reset all settings to defaults? This will not delete your API keys.')) {
    return;
  }
  
  try {
    await chrome.storage.sync.set({
      defaultProvider: 'openai',
      autoInsert: false,
      showKeyboardShortcuts: true,
      responseLength: 'medium',
      responseTone: 'casual',
      saveHistory: false,
      anonymizeData: true
    });
    
    await loadSettings();
    showNotification('Settings reset to defaults', 'success');
  } catch (error) {
    console.error('Error resetting settings:', error);
    showNotification('Error resetting settings', 'error');
  }
}

async function testConnections() {
  const modal = document.getElementById('testModal');
  const resultsDiv = document.getElementById('testResults');
  
  modal.style.display = 'block';
  resultsDiv.innerHTML = '<div class="test-result loading">Starting connection tests...</div>';
  
  const settings = await chrome.storage.sync.get(['openaiKey', 'anthropicKey', 'googleKey']);
  const providers = [
    { name: 'OpenAI', key: settings.openaiKey, id: 'openai' },
    { name: 'Anthropic', key: settings.anthropicKey, id: 'anthropic' },
    { name: 'Google', key: settings.googleKey, id: 'google' }
  ];
  
  resultsDiv.innerHTML = '';
  
  for (const provider of providers) {
    if (!provider.key) {
      resultsDiv.innerHTML += `
        <div class="test-result error">
          ${provider.name}: No API key configured
        </div>
      `;
      continue;
    }
    
    resultsDiv.innerHTML += `
      <div class="test-result loading" id="test-${provider.id}">
        ${provider.name}: Testing connection...
      </div>
    `;
    
    try {
      const result = await testProviderConnection(provider.id, provider.key);
      const testElement = document.getElementById(`test-${provider.id}`);
      
      if (result.success) {
        testElement.className = 'test-result success';
        testElement.textContent = `${provider.name}: ✅ Connection successful`;
      } else {
        testElement.className = 'test-result error';
        testElement.textContent = `${provider.name}: ❌ ${result.error}`;
      }
    } catch (error) {
      const testElement = document.getElementById(`test-${provider.id}`);
      testElement.className = 'test-result error';
      testElement.textContent = `${provider.name}: ❌ ${error.message}`;
    }
  }
}

async function testProviderConnection(provider, apiKey) {
  const testPrompt = 'Hello! Please respond with just "Test successful" to verify the connection.';
  
  try {
    let response;
    
    switch (provider) {
      case 'openai':
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 10
          })
        });
        break;
        
      case 'anthropic':
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 10,
            messages: [{ role: 'user', content: testPrompt }]
          })
        });
        break;
        
      case 'google':
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: testPrompt }] }],
            generationConfig: { maxOutputTokens: 10 }
          })
        });
        break;
        
      default:
        throw new Error('Unknown provider');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function updateProviderStatus(provider, isConfigured) {
  const statusElement = document.getElementById(`${provider}Status`);
  if (statusElement) {
    statusElement.textContent = isConfigured ? 'Configured' : 'Not configured';
    statusElement.className = `provider-status ${isConfigured ? 'configured' : ''}`;
  }
}

function togglePasswordVisibility(event) {
  const targetId = event.target.dataset.target;
  const input = document.getElementById(targetId);
  const button = event.target;
  
  if (input.type === 'password') {
    input.type = 'text';
    button.textContent = '🙈';
  } else {
    input.type = 'password';
    button.textContent = '👁️';
  }
}

function closeModal() {
  document.getElementById('testModal').style.display = 'none';
}

async function viewLogs() {
  try {
    const logs = await chrome.storage.local.get(['extensionLogs']);
    const logData = logs.extensionLogs || [];
    
    const logWindow = window.open('', '_blank', 'width=800,height=600');
    logWindow.document.write(`
      <html>
        <head><title>Comment Craft - Logs</title></head>
        <body style="font-family: monospace; padding: 20px;">
          <h2>Extension Logs</h2>
          <pre>${JSON.stringify(logData, null, 2)}</pre>
        </body>
      </html>
    `);
  } catch (error) {
    alert('Error viewing logs: ' + error.message);
  }
}

async function exportSettings() {
  try {
    const settings = await chrome.storage.sync.get();
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comment-craft-settings.json';
    a.click();
    
    URL.revokeObjectURL(url);
    showNotification('Settings exported successfully', 'success');
  } catch (error) {
    console.error('Error exporting settings:', error);
    showNotification('Error exporting settings', 'error');
  }
}

function importSettings() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const settings = JSON.parse(text);
      
      await chrome.storage.sync.set(settings);
      await loadSettings();
      showNotification('Settings imported successfully', 'success');
    } catch (error) {
      console.error('Error importing settings:', error);
      showNotification('Error importing settings - Invalid file format', 'error');
    }
  };
  
  input.click();
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
    ${type === 'success' ? 'background: #28a745;' : ''}
    ${type === 'error' ? 'background: #dc3545;' : ''}
    ${type === 'info' ? 'background: #17a2b8;' : ''}
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1';
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}