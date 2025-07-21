# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Comment Craft is a Firefox browser extension that helps users generate AI-powered responses to comments on social media platforms like YouTube, Reddit, TikTok, Instagram, Twitter/X, and Facebook. The extension integrates with multiple LLM providers (OpenAI, Anthropic Claude, Google Gemini) to generate contextual responses based on user-selected response types (funny, clapback, fact-check, de-escalate, supportive, custom).

## Architecture

### Core Components

- **manifest.json**: Firefox extension manifest (v2) defining permissions, content scripts, and UI components
- **background.js**: Service worker handling API calls to LLM providers and message passing between components
- **content.js**: Content script injected into social media sites to detect comments and provide UI interactions
- **popup.html/js/css**: Extension popup interface showing status, settings, and usage guide
- **options.html/js/css**: Settings page for API key configuration and preferences

### Key Features

- Multi-provider LLM integration (OpenAI GPT, Anthropic Claude, Google Gemini)
- Site-specific comment detection using CSS selectors for major social media platforms
- Response type selection (funny, clapback, fact-check, de-escalate, supportive, custom)
- Keyboard shortcuts (Ctrl+Shift+C) for quick access
- Auto-insertion of responses into comment fields
- Privacy-focused design with local API key storage

## Development Commands

### Testing the Extension

```bash
# Load extension in Firefox for development
# 1. Open Firefox and navigate to about:debugging
# 2. Click "This Firefox"
# 3. Click "Load Temporary Add-on"
# 4. Select manifest.json from the project directory

# For web-ext CLI tool (if installed):
web-ext run --source-dir=. --verbose

# Build for distribution
web-ext build --source-dir=. --artifacts-dir=dist/
```

### Code Structure

- **Content Script Pattern**: Uses MutationObserver to detect dynamically loaded comments
- **Site Detection**: Hostname-based routing with site-specific CSS selectors
- **API Integration**: Centralized in background.js with error handling and provider switching
- **UI Components**: Modular CSS classes with `comment-craft-` prefix to avoid conflicts
- **Storage**: Chrome storage API for settings persistence

### Platform-Specific Selectors

The extension uses site-specific CSS selectors defined in `content.js`:

- **YouTube**: `#content-text`, `yt-formatted-string#content-text`
- **Reddit**: `[data-testid="comment"]`, `.Comment`, `div[data-click-id="text"]`
- **Twitter/X**: `[data-testid="tweetText"]`, `[data-testid="tweet"]`
- **Instagram**: `article span`, `[role="button"] span`
- **TikTok**: `[data-e2e="comment-item-content"]`, `[data-e2e="browse-video-desc"]`
- **Facebook**: `[data-ad-preview="message"]`, `[role="article"] span`

### API Provider Integration

Each LLM provider has specific API requirements implemented in `background.js`:

- **OpenAI**: Uses `/v1/chat/completions` endpoint with GPT-3.5-turbo model
- **Anthropic**: Uses `/v1/messages` endpoint with Claude-3-haiku model
- **Google**: Uses Gemini Pro model via generateContent endpoint

### Response Generation

The prompt building system in `background.js` creates contextual prompts based on:
- Original comment text
- Selected response type
- User-provided custom instructions
- Platform-specific guidelines (280 char limit, tone requirements)

## Common Development Tasks

### Adding New Social Media Platform Support

1. Add hostname to manifest.json content_scripts matches array
2. Add CSS selectors to `commentSelectors` object in content.js
3. Implement site-specific insertion logic in `findInsertionPoint()` method
4. Add platform-specific input field selectors to `insertResponse()` method

### Adding New LLM Provider

1. Add provider option to popup.html and options.html select elements  
2. Implement API call function in background.js following existing pattern
3. Add provider case to `generateAIResponse()` switch statement
4. Add API key field to options page HTML and JavaScript
5. Update permissions in manifest.json if needed

### Modifying Response Types

Response types are defined in the `basePrompts` object in background.js. Each type has:
- Display name and emoji in content.js UI
- Prompt template in background.js
- Contextual guidelines for response generation

### Debugging

- Use Firefox Developer Tools console for content script debugging
- Background script logs appear in extension debugging page
- Storage values can be inspected via browser.storage API in console
- Network requests to LLM APIs visible in Network tab

## Security Considerations

- API keys stored locally using chrome.storage.sync (encrypted)
- Content Security Policy prevents external script injection
- Input sanitization for comment text before API calls
- HTTPS-only API endpoints with proper error handling
- No sensitive data logged or transmitted to external servers

## Testing Strategy

Manual testing required on each supported platform:
1. Load extension and configure API keys
2. Navigate to social media site
3. Verify comment detection and button injection
4. Test response generation for each response type
5. Verify response insertion into comment fields
6. Test keyboard shortcuts and edge cases