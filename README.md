# Comment Craft Browser Extension

🚀 **AI-powered comment responses for social media platforms**

Comment Craft is a Firefox browser extension that helps you craft intelligent, contextual responses to comments on social media platforms using your choice of AI providers (OpenAI, Anthropic Claude, or Google Gemini).

## Features

✨ **Multi-Platform Support**
- YouTube, Reddit, Twitter/X, Instagram, TikTok, Facebook
- Automatically detects comment sections on supported sites

🤖 **Multiple AI Providers**
- OpenAI GPT-3.5/4
- Anthropic Claude
- Google Gemini
- Easy switching between providers

💬 **Response Types**
- 😄 **Funny**: Witty, humorous responses
- 🔥 **Clapback**: Sharp, confident comebacks
- 📋 **Fact Check**: Polite corrections with facts
- 🕊️ **De-escalate**: Calm, diplomatic responses
- 💙 **Supportive**: Encouraging, empathetic replies
- ✏️ **Custom**: Your own prompt

⚡ **Quick Actions**
- One-click response generation
- Copy to clipboard or auto-insert
- Keyboard shortcut (Ctrl+Shift+C)

🔒 **Privacy-First**
- API keys stored locally
- No data sent to our servers
- Optional data anonymization

## Installation

### From Firefox Add-ons Store
*Coming soon*

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Firefox and go to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file

## Setup

1. **Install the extension** following the steps above
2. **Configure API keys** by clicking the extension icon and selecting "Settings"
3. **Add at least one API key** from your preferred provider:
   - [OpenAI Platform](https://platform.openai.com/api-keys)
   - [Anthropic Console](https://console.anthropic.com/)
   - [Google AI Studio](https://makersuite.google.com/app/apikey)
4. **Choose your default provider** in the settings

## Usage

### Basic Usage
1. Navigate to any supported social media platform
2. Look for the "✨ Craft Response" button next to comments
3. Click the button to open the response generator
4. Select your desired response type
5. Click "Generate Response"
6. Copy or use the generated response

### Keyboard Shortcut
- Select any comment text
- Press `Ctrl+Shift+C` (or `Cmd+Shift+C` on Mac)
- The response generator will open automatically

### Supported Platforms

| Platform | Comment Detection | Response Insertion |
|----------|------------------|-------------------|
| YouTube | ✅ | ✅ |
| Reddit | ✅ | ✅ |
| Twitter/X | ✅ | ✅ |
| Instagram | ✅ | ⚠️ |
| TikTok | ✅ | ⚠️ |
| Facebook | ✅ | ⚠️ |

*⚠️ = Manual copy/paste required due to platform restrictions*

## API Costs

The extension uses your own API keys, so you'll be charged directly by the provider:

- **OpenAI**: ~$0.001-0.003 per response
- **Anthropic**: ~$0.0004-0.0015 per response  
- **Google**: Free tier available, then ~$0.0005-0.002 per response

## Privacy & Security

- 🔐 **API keys stored locally** in your browser
- 🚫 **No data sent to our servers**
- 🔒 **Optional data anonymization** before sending to AI providers
- 📝 **Local response history** (optional)

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Clone the repository
git clone https://github.com/your-username/comment-craft-extension.git
cd comment-craft-extension

# Load in Firefox for development
# Follow manual installation steps above
```

## Troubleshooting

### Extension not working?
1. Check that you're on a supported platform
2. Verify your API key is configured correctly
3. Try refreshing the page
4. Check the browser console for errors

### Responses not generating?
1. Verify your API key has sufficient credits
2. Check your internet connection
3. Try switching to a different AI provider
4. Check if the platform has updated their layout

### Can't find the response button?
1. Try refreshing the page
2. Check if you're on a supported platform
3. Some platforms load content dynamically - wait a moment

## Roadmap

- [ ] Chrome extension support
- [ ] More social media platforms
- [ ] Response templates
- [ ] Team collaboration features
- [ ] Tone analysis
- [ ] Response scheduling

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- 🐛 [Report bugs](https://github.com/your-username/comment-craft-extension/issues)
- 💡 [Request features](https://github.com/your-username/comment-craft-extension/issues)
- 📧 [Contact us](mailto:support@commentcraft.com)

---

**Made with ❤️ by the Comment Craft team**