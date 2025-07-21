// Minimal test script - multiple approaches
console.log("🔥 CONTENT SCRIPT EXECUTING ON:", window.location.href);
console.log("🔥 Document ready state:", document.readyState);

// Approach 1: Add immediately
function addTestElement() {
  console.log("🔥 Adding test element...");
  
  const testDiv = document.createElement('div');
  testDiv.id = 'comment-craft-test';
  testDiv.innerHTML = '🔴 CONTENT SCRIPT LOADED';
  testDiv.style.cssText = `
    position: fixed !important;
    top: 50px !important;
    right: 50px !important;
    background: red !important;
    color: white !important;
    padding: 20px !important;
    z-index: 9999999 !important;
    cursor: pointer !important;
    border: 5px solid yellow !important;
    font-size: 16px !important;
    font-weight: bold !important;
    border-radius: 10px !important;
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.8) !important;
    font-family: Arial !important;
  `;

  testDiv.onclick = function() {
    alert('Content script is working! URL: ' + window.location.href);
  };

  // Try multiple ways to add it
  if (document.body) {
    document.body.appendChild(testDiv);
    console.log("🔥 Added to body");
  } else if (document.documentElement) {
    document.documentElement.appendChild(testDiv);
    console.log("🔥 Added to documentElement");
  } else {
    console.log("🔥 No body or documentElement available");
  }
}

// Try immediately
addTestElement();

// Try when DOM is ready
if (document.readyState !== 'complete') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log("🔥 DOM loaded, trying again...");
    addTestElement();
  });
  
  window.addEventListener('load', () => {
    console.log("🔥 Window loaded, trying again...");
    addTestElement();
  });
}

// Try after delay
setTimeout(() => {
  console.log("🔥 Timeout reached, trying again...");
  addTestElement();
}, 2000);

// Add to page title as another test
document.title = "🔥 EXTENSION ACTIVE - " + document.title;

console.log("🔥 Content script setup complete");