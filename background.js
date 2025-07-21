// Background script for Comment Craft extension

// Add global error handler
self.addEventListener('error', (event) => {
  console.error('Comment Craft: Global error:', event.error);
});

// Initialize extension on install
try {
  chrome.runtime.onInstalled.addListener(() => {
    console.log('Comment Craft extension installed');
  });
} catch (error) {
  console.error('Comment Craft: Error setting up onInstalled listener:', error);
}

// Add error handling for extension context
if (typeof chrome === 'undefined') {
  console.error('Comment Craft: Chrome API not available');
}

// Handle messages from content scripts
try {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Comment Craft: Received message:', request);
    
    try {
      if (request.action === 'generateResponse') {
        generateAIResponse(request.data)
          .then(response => {
            console.log('Comment Craft: Generated response:', response);
            sendResponse({ success: true, response });
          })
          .catch(error => {
            console.error('Comment Craft: Error generating response:', error);
            sendResponse({ success: false, error: error.message });
          });
        return true; // Keep message channel open for async response
      }
    } catch (error) {
      console.error('Comment Craft: Error in message handler:', error);
      sendResponse({ success: false, error: error.message });
    }
  });
} catch (error) {
  console.error('Comment Craft: Error setting up message listener:', error);
}

// Generate AI response using configured LLM
async function generateAIResponse(data) {
  const { prompt, responseType, llmProvider, originalComment } = data;
  
  // Get stored API keys and settings
  const settings = await chrome.storage.sync.get(['openaiKey', 'anthropicKey', 'googleKey', 'defaultProvider']);
  
  const apiKey = settings[`${llmProvider}Key`];
  if (!apiKey) {
    throw new Error(`API key not configured for ${llmProvider}`);
  }
  
  const fullPrompt = buildPrompt(originalComment, responseType, prompt);
  
  switch (llmProvider) {
    case 'openai':
      return await callOpenAI(fullPrompt, apiKey);
    case 'anthropic':
      return await callAnthropic(fullPrompt, apiKey);
    case 'google':
      return await callGoogle(fullPrompt, apiKey);
    default:
      throw new Error('Unsupported LLM provider');
  }
}

// Build contextual prompt based on response type
function buildPrompt(originalComment, responseType, userPrompt) {
  const basePrompts = {
    'funny': 'Generate a witty, humorous response that uses clever wordplay or irony. Keep it light but effective.',
    'clapback': 'Generate a sharp, confident comeback that addresses the comment directly without being offensive.',
    'factcheck': 'Generate a polite but firm response that corrects misinformation with facts. Include sources if relevant.',
    'deescalate': 'Generate a calm, diplomatic response that attempts to defuse tension and find common ground.',
    'supportive': 'Generate an encouraging, positive response that shows empathy and support.',
    'custom': userPrompt || 'Generate an appropriate response to this comment.'
  };
  
  const contextPrompt = basePrompts[responseType] || basePrompts['custom'];
  
  return `You are helping someone respond to a social media comment. The original comment was: "${originalComment}"

${contextPrompt}

Guidelines:
- Keep the response under 280 characters
- Be respectful while being effective
- Don't use offensive language
- Make it sound natural and human
- Focus on the content, not personal attacks

Generate only the response text, no explanations or quotes.`;
}

// OpenAI API call
async function callOpenAI(prompt, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// Anthropic Claude API call
async function callAnthropic(prompt, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  
  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.content[0].text.trim();
}

// Google Gemini API call
async function callGoogle(prompt, apiKey) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`Google API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text.trim();
}