// Ultra simple test - should work on ANY website
console.log("🚀 EXTENSION IS LOADING - URL:", window.location.href);

// Add visible test element immediately
function addTestElement() {
    console.log("🚀 Creating test element...");
    
    const testElement = document.createElement('div');
    testElement.id = 'extension-test-element';
    testElement.innerHTML = '🚀 EXTENSION WORKING!';
    testElement.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        background: red !important;
        color: white !important;
        padding: 15px !important;
        font-size: 18px !important;
        font-weight: bold !important;
        z-index: 999999 !important;
        border: 5px solid yellow !important;
        border-radius: 10px !important;
        cursor: pointer !important;
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.8) !important;
        font-family: Arial, sans-serif !important;
    `;
    
    testElement.onclick = function() {
        alert('Extension is working! Current URL: ' + window.location.href);
        console.log("🚀 Test element clicked!");
    };
    
    // Try multiple ways to add it
    try {
        if (document.body) {
            document.body.appendChild(testElement);
            console.log("🚀 Added to document.body");
        } else if (document.documentElement) {
            document.documentElement.appendChild(testElement);
            console.log("🚀 Added to document.documentElement");
        } else {
            console.log("🚀 ERROR: No body or documentElement available");
            return;
        }
        
        // Also modify page title as secondary indicator
        document.title = "🚀 EXT LOADED - " + document.title;
        console.log("🚀 Title modified to:", document.title);
        
    } catch (error) {
        console.error("🚀 ERROR adding test element:", error);
    }
}

// Try adding immediately
addTestElement();

// Also try after a delay in case page is still loading
setTimeout(addTestElement, 1000);
setTimeout(addTestElement, 3000);

console.log("🚀 Test script setup complete");