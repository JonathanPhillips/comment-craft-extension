// Simple version of content script for debugging
console.log('Comment Craft: Simple content script loading...');

// Add simple styles
const style = document.createElement('style');
style.textContent = `
  .comment-craft-test-button {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
    color: white !important;
    border: 2px solid #a855f7 !important;
    padding: 6px 12px !important;
    border-radius: 16px !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    margin: 4px 8px !important;
    z-index: 9999 !important;
    position: relative !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
    box-shadow: 0 2px 6px rgba(124, 58, 237, 0.3) !important;
  }
`;
document.head.appendChild(style);

// Simple function to add test buttons
function addTestButtons() {
  console.log('Comment Craft: Adding test buttons...');
  
  // YouTube comment selectors
  const comments = document.querySelectorAll('#content-text, yt-formatted-string#content-text');
  console.log('Comment Craft: Found', comments.length, 'comments');
  
  comments.forEach((comment, index) => {
    if (comment.querySelector('.comment-craft-test-button')) {
      return; // Already has button
    }
    
    const button = document.createElement('button');
    button.className = 'comment-craft-test-button';
    button.textContent = '✨ Test';
    button.onclick = () => {
      alert('Button ' + index + ' clicked! Comment: ' + comment.textContent.substring(0, 50) + '...');
    };
    
    // Try to append to parent
    try {
      if (comment.parentElement) {
        comment.parentElement.appendChild(button);
        console.log('Comment Craft: Added button', index);
      }
    } catch (error) {
      console.error('Comment Craft: Error adding button:', error);
    }
  });
}

// Run every few seconds to catch new comments
setInterval(() => {
  try {
    addTestButtons();
  } catch (error) {
    console.error('Comment Craft: Error in interval:', error);
  }
}, 3000);

// Initial run
setTimeout(() => {
  try {
    addTestButtons();
  } catch (error) {
    console.error('Comment Craft: Error in initial run:', error);
  }
}, 2000);

console.log('Comment Craft: Simple script initialized');