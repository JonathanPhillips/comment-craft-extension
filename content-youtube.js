// YouTube-specific comment detection
console.log("🎬 YouTube Comment Craft loading...");

// Check if we're on YouTube
if (!window.location.hostname.includes('youtube.com')) {
    console.log("🎬 Not on YouTube, exiting");
} else {
    console.log("🎬 On YouTube:", window.location.href);
    
    // Response panel functionality
    function showResponsePanel(commentText, commentElement) {
        console.log("🎬 Opening response panel for:", commentText.substring(0, 50));
        
        // Remove any existing panel
        const existingPanel = document.querySelector('.comment-craft-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'comment-craft-overlay';
        overlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0, 0, 0, 0.7) !important;
            z-index: 999998 !important;
            cursor: pointer !important;
        `;
        
        // Create panel
        const panel = document.createElement('div');
        panel.className = 'comment-craft-panel';
        panel.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            background: white !important;
            border-radius: 12px !important;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
            padding: 24px !important;
            z-index: 999999 !important;
            width: 500px !important;
            max-width: 90vw !important;
            max-height: 80vh !important;
            overflow-y: auto !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        `;
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #333; font-size: 18px;">✨ Craft Your Response</h3>
                <button class="close-panel" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">×</button>
            </div>
            
            <div style="background: #f5f5f5; padding: 12px; border-radius: 8px; margin-bottom: 16px; max-height: 100px; overflow-y: auto;">
                <strong style="color: #333;">Original comment:</strong><br>
                <span style="color: #666; font-size: 13px;">${commentText}</span>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 16px;">
                <button class="response-type" data-type="funny" style="padding: 8px 12px; border: 2px solid #e0e0e0; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; text-align: center;">😄 Funny</button>
                <button class="response-type" data-type="clapback" style="padding: 8px 12px; border: 2px solid #e0e0e0; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; text-align: center;">🔥 Clapback</button>
                <button class="response-type" data-type="factcheck" style="padding: 8px 12px; border: 2px solid #e0e0e0; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; text-align: center;">📋 Fact Check</button>
                <button class="response-type" data-type="deescalate" style="padding: 8px 12px; border: 2px solid #e0e0e0; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; text-align: center;">🕊️ De-escalate</button>
                <button class="response-type" data-type="supportive" style="padding: 8px 12px; border: 2px solid #e0e0e0; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; text-align: center;">💙 Supportive</button>
                <button class="response-type selected" data-type="custom" style="padding: 8px 12px; border: 2px solid #4285f4; border-radius: 8px; background: #f0f4ff; cursor: pointer; font-size: 12px; text-align: center; color: #4285f4;">✏️ Custom</button>
            </div>
            
            <textarea class="custom-prompt" placeholder="Describe how you want to respond..." style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 13px; margin-bottom: 16px; font-family: inherit; resize: vertical; min-height: 60px; box-sizing: border-box;"></textarea>
            
            <button class="generate-response" style="width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 500; cursor: pointer; margin-bottom: 16px; font-size: 14px;">Generate Response</button>
            
            <div class="response-result" style="display: none; background: #f9f9f9; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 13px; color: #333; min-height: 40px; border: 1px solid #e0e0e0;">
                <div class="result-text"></div>
                <div style="display: flex; gap: 8px; margin-top: 12px;">
                    <button class="copy-response" style="flex: 1; padding: 8px 16px; border: 1px solid #4285f4; border-radius: 6px; cursor: pointer; font-size: 12px; background: white; color: #4285f4;">Copy</button>
                    <button class="use-response" style="flex: 1; padding: 8px 16px; border: 1px solid #4285f4; border-radius: 6px; cursor: pointer; font-size: 12px; background: #4285f4; color: white;">Use Response</button>
                </div>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(overlay);
        document.body.appendChild(panel);
        
        // Setup event listeners
        setupPanelEventListeners(panel, overlay, commentText, commentElement);
        
        console.log("🎬 Response panel created");
    }
    
    function setupPanelEventListeners(panel, overlay, commentText, commentElement) {
        // Close panel
        const closeBtn = panel.querySelector('.close-panel');
        const closePanel = () => {
            panel.remove();
            overlay.remove();
        };
        
        closeBtn.onclick = closePanel;
        overlay.onclick = closePanel;
        
        // Response type selection
        const responseTypes = panel.querySelectorAll('.response-type');
        const customPrompt = panel.querySelector('.custom-prompt');
        
        responseTypes.forEach(btn => {
            btn.onclick = () => {
                // Remove selected from all
                responseTypes.forEach(b => {
                    b.style.borderColor = '#e0e0e0';
                    b.style.background = 'white';
                    b.style.color = 'black';
                });
                
                // Add selected to clicked
                btn.style.borderColor = '#4285f4';
                btn.style.background = '#f0f4ff';
                btn.style.color = '#4285f4';
                
                // Show/hide custom prompt
                customPrompt.style.display = btn.dataset.type === 'custom' ? 'block' : 'none';
            };
        });
        
        // Generate response
        const generateBtn = panel.querySelector('.generate-response');
        generateBtn.onclick = () => {
            const selectedType = panel.querySelector('.response-type[style*="#4285f4"]');
            const responseType = selectedType?.dataset.type || 'custom';
            const customText = customPrompt.value;
            
            console.log("🎬 Generating response:", responseType, customText);
            
            generateBtn.textContent = 'Generating...';
            generateBtn.disabled = true;
            
            // Simple mock response for now
            setTimeout(() => {
                const mockResponse = generateMockResponse(commentText, responseType, customText);
                
                const resultDiv = panel.querySelector('.response-result');
                const resultText = panel.querySelector('.result-text');
                
                resultText.textContent = mockResponse;
                resultDiv.style.display = 'block';
                
                generateBtn.textContent = 'Generate Response';
                generateBtn.disabled = false;
                
                console.log("🎬 Response generated:", mockResponse);
            }, 1500);
        };
        
        // Copy response
        const copyBtn = panel.querySelector('.copy-response');
        copyBtn.onclick = () => {
            const responseText = panel.querySelector('.result-text').textContent;
            navigator.clipboard.writeText(responseText).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                    
                    // Re-scan for buttons after copy in case DOM changed
                    console.log("🎬 Re-scanning for buttons after copy");
                    findAndAddButtons();
                }, 2000);
            });
        };
        
        // Use response (placeholder)
        const useBtn = panel.querySelector('.use-response');
        useBtn.onclick = () => {
            const responseText = panel.querySelector('.result-text').textContent;
            console.log("🎬 Using response:", responseText);
            
            // Copy to clipboard
            navigator.clipboard.writeText(responseText).then(() => {
                alert('Response copied to clipboard!\n\n(Auto-insertion to YouTube comment box coming soon)');
                closePanel();
                
                // Re-scan for buttons after a short delay since YouTube might update DOM
                setTimeout(() => {
                    console.log("🎬 Re-scanning for buttons after use response");
                    findAndAddButtons();
                }, 1000);
            });
        };
    }
    
    function generateMockResponse(originalComment, responseType, customPrompt) {
        const responses = {
            funny: "That's hilarious! Though I'm not sure if we're laughing with you or at the situation 😄",
            clapback: "Interesting perspective, though I'd love to see the data backing that up 🤔",
            factcheck: "Actually, recent studies show that's not quite accurate. Here's what the research says...",
            deescalate: "I understand where you're coming from. Let's find some common ground here.",
            supportive: "Thanks for sharing your thoughts! It's great to see different perspectives.",
            custom: customPrompt || "That's an interesting point you've raised."
        };
        
        return responses[responseType] || responses.custom;
    }
    
    // Clean up any duplicate buttons first
    function cleanupDuplicateButtons() {
        const allButtons = document.querySelectorAll('.comment-craft-button');
        const seen = new Set();
        
        allButtons.forEach(button => {
            const parent = button.parentElement;
            const parentId = parent?.id || parent?.className || 'unknown';
            
            if (seen.has(parentId)) {
                console.log("🎬 Removing duplicate button");
                button.remove();
            } else {
                seen.add(parentId);
            }
        });
    }
    
    // Simple comment detection for YouTube
    function findAndAddButtons() {
        console.log("🎬 Looking for YouTube comments...");
        
        // Clean up duplicates first
        cleanupDuplicateButtons();
        
        // YouTube comment selectors - be more specific to avoid conflicts
        const commentSelectors = [
            'ytd-comment-renderer #content-text',           // Main comments
            'ytd-comment-reply-renderer #content-text',     // Reply comments
            '#content-text:not([data-comment-craft-processed])'  // Fallback for unprocessed
        ];
        
        let commentsFound = 0;
        
        commentSelectors.forEach((selector, selectorIndex) => {
            const comments = document.querySelectorAll(selector);
            console.log(`🎬 Selector ${selectorIndex + 1}: "${selector}" found ${comments.length} comments`);
            
            comments.forEach((comment, index) => {
                const commentText = comment.textContent.trim();
                if (!commentText || commentText.length < 3) {
                    return; // Skip empty or very short comments
                }
                
                // Create a unique ID for this comment based on its text
                const commentId = 'comment-' + commentText.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                
                // Skip if already processed using both data attribute and unique ID
                if (comment.getAttribute('data-comment-craft-processed') === 'true' ||
                    comment.getAttribute('data-comment-id') === commentId) {
                    return;
                }
                
                // Skip if already has button - check multiple locations
                const commentContainer = comment.closest('#comment') || comment.parentElement;
                if (commentContainer?.querySelector('.comment-craft-button')) {
                    // Mark as processed even if button exists
                    comment.setAttribute('data-comment-craft-processed', 'true');
                    comment.setAttribute('data-comment-id', commentId);
                    return;
                }
                
                // Mark this comment as processed immediately
                comment.setAttribute('data-comment-craft-processed', 'true');
                comment.setAttribute('data-comment-id', commentId);
                
                commentsFound++;
                
                // Create button
                const button = document.createElement('button');
                button.className = 'comment-craft-button';
                button.innerHTML = '✨ Craft Response';
                button.style.cssText = `
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
                `;
                
                button.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log("🎬 Button clicked for comment:", commentText.substring(0, 50) + "...");
                    
                    // Open response panel
                    showResponsePanel(commentText, comment);
                };
                
                // Try to find the best place to insert the button
                let insertionPoint = null;
                
                // For main comments and replies, look for different toolbar locations
                const commentRenderer = comment.closest('ytd-comment-renderer, ytd-comment-reply-renderer');
                const isMainComment = comment.closest('ytd-comment-renderer') && !comment.closest('ytd-comment-reply-renderer');
                const isReply = !!comment.closest('ytd-comment-reply-renderer');
                
                console.log(`🎬 Comment ${commentsFound}: ${isMainComment ? 'MAIN' : isReply ? 'REPLY' : 'UNKNOWN'} - "${commentText.substring(0, 30)}..."`);
                
                if (commentRenderer) {
                    // Try multiple toolbar locations
                    insertionPoint = 
                        commentRenderer.querySelector('#toolbar') ||
                        commentRenderer.querySelector('#action-buttons') ||
                        commentRenderer.querySelector('[role="toolbar"]') ||
                        comment.parentElement;
                    
                    console.log(`🎬 Found insertion point: ${insertionPoint?.tagName || 'none'} ${insertionPoint?.id || insertionPoint?.className || ''}`);
                } else {
                    // Fallback for other comment structures
                    insertionPoint = comment.parentElement;
                    console.log(`🎬 Using fallback insertion point: ${insertionPoint?.tagName || 'none'}`);
                }
                
                try {
                    if (insertionPoint) {
                        // Create a wrapper to ensure consistent placement
                        const buttonWrapper = document.createElement('span');
                        buttonWrapper.style.cssText = 'margin-left: 8px; display: inline-block;';
                        buttonWrapper.appendChild(button);
                        
                        insertionPoint.appendChild(buttonWrapper);
                        console.log(`🎬 Added button ${commentsFound} to comment: ${commentText.substring(0, 30)}...`);
                    } else {
                        console.log("🎬 Could not find insertion point for comment");
                    }
                } catch (error) {
                    console.error("🎬 Error adding button:", error);
                }
            });
        });
        
        console.log(`🎬 Total buttons added: ${commentsFound}`);
        
        // Remove the test indicator since real functionality is working
        const testElement = document.getElementById('extension-test-element');
        if (testElement) {
            testElement.remove();
        }
    }
    
    // Run immediately
    setTimeout(findAndAddButtons, 2000);
    
    // Re-run less frequently for dynamically loaded comments
    setInterval(findAndAddButtons, 15000);
    
    // Watch for URL changes (YouTube is SPA)
    let currentUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            console.log("🎬 URL changed, re-scanning comments in 3 seconds");
            setTimeout(findAndAddButtons, 3000);
        }
    }, 1000);
    
    // Add mutation observer to watch for new comments being loaded
    const observer = new MutationObserver((mutations) => {
        let shouldRescan = false;
        
        mutations.forEach((mutation) => {
            // Check if new comment nodes were added
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && 
                    (node.querySelector('#content-text') || 
                     node.id === 'content-text' ||
                     node.matches?.('#content-text'))) {
                    shouldRescan = true;
                }
            });
        });
        
        if (shouldRescan) {
            console.log("🎬 New comments detected via mutation observer, re-scanning...");
            setTimeout(findAndAddButtons, 500);
        }
    });
    
    // Start observing YouTube's comments container
    const commentsContainer = document.querySelector('#comments, ytd-comments, #contents');
    if (commentsContainer) {
        observer.observe(commentsContainer, {
            childList: true,
            subtree: true
        });
        console.log("🎬 Mutation observer attached to comments container");
    } else {
        // Fallback: observe the whole document
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        console.log("🎬 Mutation observer attached to document body");
    }
    
    console.log("🎬 YouTube Comment Craft initialized");
}