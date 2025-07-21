// Simplified YouTube comment detection - universal approach
console.log("🎬 YouTube Comment Craft (Simple) loading...");

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
        const existingOverlay = document.querySelector('.comment-craft-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
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
                    setTimeout(findAllComments, 1000);
                }, 2000);
            });
        };
        
        // Use response
        const useBtn = panel.querySelector('.use-response');
        useBtn.onclick = () => {
            const responseText = panel.querySelector('.result-text').textContent;
            console.log("🎬 Using response:", responseText);
            
            // Copy to clipboard
            navigator.clipboard.writeText(responseText).then(() => {
                alert('Response copied to clipboard!\n\n(Auto-insertion to YouTube comment box coming soon)');
                closePanel();
                
                // Re-scan for buttons after use response
                setTimeout(() => {
                    console.log("🎬 Re-scanning for buttons after use response");
                    findAllComments();
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
    
    // Universal comment detection function
    function findAllComments() {
        console.log("🎬 Looking for ALL YouTube comments (universal method)...");
        
        // Find all elements that contain comment text
        const allTextElements = document.querySelectorAll('*');
        const commentElements = [];
        
        allTextElements.forEach(element => {
            // Check if this looks like a comment element
            if (element.id === 'content-text' || 
                element.getAttribute('id') === 'content-text' ||
                (element.tagName === 'YT-FORMATTED-STRING' && element.id === 'content-text')) {
                
                const text = element.textContent?.trim();
                if (text && text.length > 10) { // Only process substantial comments
                    commentElements.push(element);
                }
            }
        });
        
        console.log(`🎬 Found ${commentElements.length} comment elements total`);
        
        let buttonsAdded = 0;
        
        commentElements.forEach((comment, index) => {
            const commentText = comment.textContent.trim();
            
            // Skip if already has button anywhere nearby
            if (comment.closest('ytd-comment-renderer, ytd-comment-reply-renderer')?.querySelector('.comment-craft-button')) {
                console.log(`🎬 Comment ${index + 1}: Already has button - "${commentText.substring(0, 30)}..."`);
                return;
            }
            
            // Skip if already processed
            if (comment.getAttribute('data-comment-craft-processed') === 'true') {
                console.log(`🎬 Comment ${index + 1}: Already processed - "${commentText.substring(0, 30)}..."`);
                return;
            }
            
            // Mark as processed
            comment.setAttribute('data-comment-craft-processed', 'true');
            
            // Determine comment type for debugging
            const isInMainComment = !!comment.closest('ytd-comment-renderer:not(ytd-comment-reply-renderer ytd-comment-renderer)');
            const isInReply = !!comment.closest('ytd-comment-reply-renderer');
            const commentType = isInMainComment ? 'MAIN' : isInReply ? 'REPLY' : 'UNKNOWN';
            
            console.log(`🎬 Comment ${index + 1}: ${commentType} - "${commentText.substring(0, 30)}..."`);
            
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
                showResponsePanel(commentText, comment);
            };
            
            // Find the best insertion point - try multiple strategies
            let insertionPoint = null;
            
            // Strategy 1: Look for action buttons area
            const commentContainer = comment.closest('ytd-comment-renderer, ytd-comment-reply-renderer');
            if (commentContainer) {
                insertionPoint = commentContainer.querySelector('#toolbar, #action-buttons, [role="toolbar"]');
            }
            
            // Strategy 2: Look for like/reply buttons area
            if (!insertionPoint && commentContainer) {
                const likeButton = commentContainer.querySelector('[aria-label*="like"], [aria-label*="Like"]');
                if (likeButton) {
                    insertionPoint = likeButton.parentElement;
                }
            }
            
            // Strategy 3: Insert after the comment text
            if (!insertionPoint) {
                insertionPoint = comment.parentElement;
            }
            
            // Strategy 4: Create our own container
            if (!insertionPoint) {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = 'margin-top: 8px;';
                comment.parentElement?.appendChild(wrapper);
                insertionPoint = wrapper;
            }
            
            try {
                if (insertionPoint) {
                    insertionPoint.appendChild(button);
                    buttonsAdded++;
                    console.log(`🎬 ✅ Added button ${buttonsAdded} to ${commentType} comment`);
                } else {
                    console.log(`🎬 ❌ Could not find insertion point for ${commentType} comment`);
                }
            } catch (error) {
                console.error("🎬 Error adding button:", error);
            }
        });
        
        console.log(`🎬 Total buttons added: ${buttonsAdded} out of ${commentElements.length} comments`);
        
        // Remove test indicator
        const testElement = document.getElementById('extension-test-element');
        if (testElement) testElement.remove();
        
        return buttonsAdded;
    }
    
    // Run initial scan
    setTimeout(() => {
        console.log("🎬 Running initial comment scan...");
        findAllComments();
    }, 3000);
    
    // Periodic rescan
    setInterval(() => {
        console.log("🎬 Running periodic comment scan...");
        findAllComments();
    }, 10000);
    
    // Watch for URL changes
    let currentUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            console.log("🎬 URL changed, scanning for comments...");
            setTimeout(findAllComments, 2000);
        }
    }, 1000);
    
    console.log("🎬 YouTube Comment Craft (Simple) initialized");
}