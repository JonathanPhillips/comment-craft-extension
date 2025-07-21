// Test suite for Comment Craft extension
// Run this in browser console when extension is loaded

console.log('🧪 Starting Comment Craft Extension Tests...');

class CommentCraftTester {
  constructor() {
    this.results = [];
    this.testCount = 0;
    this.passedCount = 0;
  }

  test(name, testFn) {
    this.testCount++;
    console.log(`🧪 Test ${this.testCount}: ${name}`);
    
    try {
      const result = testFn();
      if (result) {
        this.passedCount++;
        console.log(`✅ PASS: ${name}`);
        this.results.push({ name, status: 'PASS', message: '' });
      } else {
        console.log(`❌ FAIL: ${name}`);
        this.results.push({ name, status: 'FAIL', message: 'Test returned false' });
      }
    } catch (error) {
      console.log(`❌ ERROR: ${name} - ${error.message}`);
      this.results.push({ name, status: 'ERROR', message: error.message });
    }
  }

  async asyncTest(name, testFn) {
    this.testCount++;
    console.log(`🧪 Async Test ${this.testCount}: ${name}`);
    
    try {
      const result = await testFn();
      if (result) {
        this.passedCount++;
        console.log(`✅ PASS: ${name}`);
        this.results.push({ name, status: 'PASS', message: '' });
      } else {
        console.log(`❌ FAIL: ${name}`);
        this.results.push({ name, status: 'FAIL', message: 'Async test returned false' });
      }
    } catch (error) {
      console.log(`❌ ERROR: ${name} - ${error.message}`);
      this.results.push({ name, status: 'ERROR', message: error.message });
    }
  }

  summary() {
    console.log('\n🧪 TEST SUMMARY');
    console.log('================');
    console.log(`Total Tests: ${this.testCount}`);
    console.log(`Passed: ${this.passedCount}`);
    console.log(`Failed: ${this.testCount - this.passedCount}`);
    console.log(`Success Rate: ${Math.round((this.passedCount / this.testCount) * 100)}%`);
    
    console.log('\nDetailed Results:');
    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : (result.status === 'FAIL' ? '❌' : '💥');
      console.log(`${icon} ${result.name} ${result.message ? '- ' + result.message : ''}`);
    });
  }
}

// Create tester instance
const tester = new CommentCraftTester();

// Basic Extension Tests
tester.test('Extension context exists', () => {
  return typeof chrome !== 'undefined' || typeof browser !== 'undefined';
});

tester.test('Content script loaded', () => {
  return typeof window.CommentCraft !== 'undefined' || 
         document.querySelector('.comment-craft-button') !== null ||
         document.querySelector('style').textContent.includes('comment-craft');
});

tester.test('CSS styles loaded', () => {
  const styles = Array.from(document.styleSheets);
  return styles.some(sheet => {
    try {
      return Array.from(sheet.cssRules).some(rule => 
        rule.selectorText && rule.selectorText.includes('comment-craft')
      );
    } catch {
      return false;
    }
  }) || Array.from(document.querySelectorAll('style')).some(style => 
    style.textContent.includes('comment-craft')
  );
});

// Site Detection Tests
tester.test('Site detection works', () => {
  const hostname = window.location.hostname;
  const supportedSites = ['youtube.com', 'reddit.com', 'tiktok.com', 'twitter.com', 'x.com'];
  return supportedSites.some(site => hostname.includes(site));
});

// DOM Manipulation Tests
tester.test('Can create and style elements', () => {
  const testDiv = document.createElement('div');
  testDiv.className = 'comment-craft-test';
  testDiv.style.cssText = 'color: red; background: blue;';
  document.body.appendChild(testDiv);
  
  const success = document.querySelector('.comment-craft-test') !== null;
  testDiv.remove();
  return success;
});

// Storage Tests (if available)
if (typeof chrome !== 'undefined' && chrome.storage) {
  tester.asyncTest('Storage API works', async () => {
    try {
      await chrome.storage.local.set({ test: 'value' });
      const result = await chrome.storage.local.get(['test']);
      await chrome.storage.local.remove(['test']);
      return result.test === 'value';
    } catch {
      return false;
    }
  });
}

// Comment Detection Tests (site-specific)
if (window.location.hostname.includes('youtube.com')) {
  tester.test('YouTube comment selectors exist', () => {
    const selectors = ['#content-text', 'yt-formatted-string#content-text'];
    return selectors.some(selector => document.querySelector(selector) !== null);
  });
  
  tester.test('YouTube comments have text content', () => {
    const comments = document.querySelectorAll('#content-text, yt-formatted-string#content-text');
    return Array.from(comments).some(comment => comment.textContent.trim().length > 0);
  });
}

if (window.location.hostname.includes('reddit.com')) {
  tester.test('Reddit comment selectors exist', () => {
    const selectors = ['[data-testid="comment"]', '.Comment', 'div[data-click-id="text"]'];
    return selectors.some(selector => document.querySelector(selector) !== null);
  });
}

if (window.location.hostname.includes('tiktok.com')) {
  tester.test('TikTok comment selectors exist', () => {
    const selectors = ['[data-e2e="comment-item-content"]', '[data-e2e="browse-video-desc"]'];
    return selectors.some(selector => document.querySelector(selector) !== null);
  });
}

// Button Injection Tests
tester.test('Can inject buttons into DOM', () => {
  const testComment = document.createElement('div');
  testComment.textContent = 'This is a test comment';
  testComment.className = 'test-comment';
  document.body.appendChild(testComment);
  
  const testButton = document.createElement('button');
  testButton.className = 'comment-craft-test-button';
  testButton.textContent = '✨ Test';
  testComment.appendChild(testButton);
  
  const success = document.querySelector('.comment-craft-test-button') !== null;
  testComment.remove();
  return success;
});

// Event Handling Tests
tester.test('Can handle click events', () => {
  let clicked = false;
  const testButton = document.createElement('button');
  testButton.addEventListener('click', () => { clicked = true; });
  testButton.click();
  return clicked;
});

// Modal/Panel Tests
tester.test('Can create modal overlay', () => {
  const overlay = document.createElement('div');
  overlay.className = 'test-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
  `;
  document.body.appendChild(overlay);
  
  const success = document.querySelector('.test-overlay') !== null;
  overlay.remove();
  return success;
});

// Keyboard Event Tests
tester.test('Can detect keyboard shortcuts', () => {
  let shortcutDetected = false;
  
  const handler = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
      shortcutDetected = true;
    }
  };
  
  document.addEventListener('keydown', handler);
  
  // Simulate the keyboard shortcut
  const event = new KeyboardEvent('keydown', {
    key: 'C',
    ctrlKey: true,
    shiftKey: true,
    bubbles: true
  });
  document.dispatchEvent(event);
  
  document.removeEventListener('keydown', handler);
  return shortcutDetected;
});

// Wait for async tests to complete, then show summary
setTimeout(() => {
  tester.summary();
  
  // Additional manual testing instructions
  console.log('\n🔧 MANUAL TESTING CHECKLIST');
  console.log('============================');
  console.log('1. Load extension in Firefox (about:debugging)');
  console.log('2. Configure API keys in extension settings');
  console.log('3. Visit YouTube, Reddit, or TikTok');
  console.log('4. Look for "✨ Craft Response" buttons near comments');
  console.log('5. Click button to open response panel');
  console.log('6. Test different response types');
  console.log('7. Try keyboard shortcut Ctrl+Shift+C');
  console.log('8. Verify response generation works');
  console.log('9. Test copy and insert functionality');
  console.log('10. Check browser console for errors');
  
}, 1000);

console.log('🧪 Comment Craft Extension Tests Complete!');