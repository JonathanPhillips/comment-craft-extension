# Testing Comment Craft Extension Locally

## Firefox Development Setup

### 1. Load Extension in Firefox
1. Open Firefox
2. Navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on..."
5. Navigate to your extension folder and select `manifest.json`
6. The extension should appear in the list with a green dot

### 2. Configure API Keys
1. Click the Comment Craft icon in the toolbar (puzzle piece icon if not pinned)
2. Click "Settings" button in the popup
3. Add at least one API key:
   - **OpenAI**: Get from https://platform.openai.com/api-keys
   - **Anthropic**: Get from https://console.anthropic.com/
   - **Google**: Get from https://makersuite.google.com/app/apikey
4. Save settings

### 3. Test on Social Media Sites

#### YouTube Testing
1. Go to https://youtube.com
2. Open any video with comments
3. Scroll down to the comments section
4. Look for "✨ Craft Response" buttons next to comments
5. Click a button to test response generation

#### Reddit Testing
1. Go to https://reddit.com
2. Open any post with comments
3. Look for "✨ Craft Response" buttons
4. Test the response generation

#### Quick Test Sites
- **YouTube**: https://www.youtube.com/watch?v=dQw4w9WgXcQ (popular video with lots of comments)
- **Reddit**: https://www.reddit.com/r/AskReddit/top/ (active discussion threads)
- **Twitter**: https://twitter.com/home (if logged in)

### 4. Debugging

#### Browser Console
1. Press F12 to open Developer Tools
2. Check Console tab for any JavaScript errors
3. Content script logs will appear here

#### Extension Debugging
1. Go to `about:debugging`
2. Find your extension and click "Inspect"
3. This opens the background script debugger
4. Check for API call errors or storage issues

#### Common Issues & Solutions

**"Craft Response" buttons not appearing:**
- Check browser console for errors
- Verify you're on a supported site
- Try refreshing the page
- Check if site layout has changed

**Response generation fails:**
- Verify API key is correct and has credits
- Check Network tab in DevTools for failed API calls
- Try switching to different LLM provider

**Buttons appear but don't work:**
- Check if popup is blocked
- Verify extension permissions
- Look for JavaScript errors in console

### 5. Manual Testing Checklist

#### Basic Functionality
- [ ] Extension loads without errors
- [ ] Popup opens and shows correct status
- [ ] Settings page opens and saves API keys
- [ ] Status indicator updates when API keys added

#### Comment Detection
- [ ] Buttons appear on YouTube comments
- [ ] Buttons appear on Reddit comments  
- [ ] Buttons appear on Twitter/X posts
- [ ] No duplicate buttons on same comment

#### Response Generation
- [ ] Response panel opens when button clicked
- [ ] All response types selectable
- [ ] Custom prompt field works
- [ ] Generate button creates responses
- [ ] Different LLM providers work

#### Response Usage
- [ ] Copy button copies to clipboard
- [ ] Use Response button inserts text (where supported)
- [ ] Keyboard shortcut (Ctrl+Shift+C) works
- [ ] Modal closes properly

### 6. Performance Testing
- Test on pages with many comments (100+)
- Check for memory leaks with long browsing sessions
- Verify buttons don't slow down page scrolling

### 7. Edge Cases
- Test on private/incognito browsing
- Test with ad blockers enabled
- Test with slow internet connection
- Test API rate limiting scenarios