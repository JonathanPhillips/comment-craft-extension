// Test background script
console.log("🔥 Background script loaded!");

// Firefox compatibility check
let api;
if (typeof browser !== 'undefined') {
  api = browser;
  console.log("🔥 Using Firefox browser API");
} else if (typeof chrome !== 'undefined') {
  api = chrome;
  console.log("🔥 Using Chrome API");
} else {
  console.log("🔥 No extension API available");
}

// Listen for extension events
try {
  if (api) {
    api.runtime.onStartup.addListener(() => {
      console.log("🔥 Extension started up");
    });
    
    api.runtime.onInstalled.addListener((details) => {
      console.log("🔥 Extension installed/updated:", details.reason);
    });
    
    // Listen for tab updates
    api.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        console.log("🔥 Tab updated:", tab.url);
        
        if (tab.url.includes('youtube.com')) {
          console.log("🔥 YouTube tab detected:", tab.url);
          
          // Wait a bit then try manual injection
          setTimeout(() => {
            api.tabs.executeScript(tabId, {
              code: `
                console.log("🔴 AUTO INJECTION from background");
                const autoDiv = document.createElement('div');
                autoDiv.innerHTML = '🔴 AUTO BACKGROUND INJECTION';
                autoDiv.style.cssText = 'position:fixed;top:200px;right:50px;background:purple;color:white;padding:15px;z-index:9999999;border:3px solid white;border-radius:8px;font-weight:bold;';
                autoDiv.onclick = () => alert('Auto injection from background works!');
                document.body.appendChild(autoDiv);
                document.title = '🔴 AUTO - ' + document.title.replace(/🔴 AUTO - /g, '');
              `
            }).then(() => {
              console.log("🔥 Auto injection successful");
            }).catch(e => {
              console.log("🔥 Auto injection failed:", e);
            });
          }, 2000);
        }
      }
    });
  }
  
} catch (error) {
  console.error("🔥 Error setting up background script:", error);
}

console.log("🔥 Background script setup complete");