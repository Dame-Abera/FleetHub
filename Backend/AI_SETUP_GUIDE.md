# 🤖 AI Chatbot Setup Guide

## Free AI Providers for Your FleetHub Chatbot

### 🥇 **Hugging Face (Recommended)**
- **Free tier**: 30,000 requests/month
- **Global access**: ✅ Yes
- **Setup**: Very easy
- **Models**: DialoGPT, Llama, Mistral

**How to get API key:**
1. Go to [huggingface.co](https://huggingface.co)
2. Create free account
3. Go to Settings → Access Tokens
4. Create new token
5. Copy the token

### 🥈 **Groq (Fast Alternative)**
- **Free tier**: 14,400 requests/day
- **Global access**: ✅ Yes
- **Speed**: Very fast
- **Models**: Llama 3.1, Mixtral

**How to get API key:**
1. Go to [console.groq.com](https://console.groq.com)
2. Create free account
3. Go to API Keys section
4. Create new key
5. Copy the key

### 🥉 **Together AI (Good Alternative)**
- **Free tier**: $5 credit monthly
- **Global access**: ✅ Yes
- **Models**: Llama, Mistral, Qwen

**How to get API key:**
1. Go to [together.ai](https://together.ai)
2. Create free account
3. Go to API Keys
4. Create new key
5. Copy the key

## 🔧 Environment Setup

Add to your `.env` file in the Backend folder:

```bash
# Choose one or more AI providers
HUGGING_FACE_API_KEY="your-hugging-face-api-key-here"
GROQ_API_KEY="your-groq-api-key-here"
TOGETHER_API_KEY="your-together-api-key-here"
```

## 🚀 Features Included

✅ **Smart Fallback System** - Works even without API keys
✅ **Car-Specific Responses** - Understands car rental/sale context
✅ **Quick Questions** - Pre-defined helpful questions
✅ **Global Access** - Works worldwide
✅ **Responsive Design** - Works on mobile and desktop
✅ **Real-time Chat** - Instant responses

## 🎯 Chatbot Capabilities

The chatbot can help users with:
- Finding cars to rent or buy
- Answering questions about the platform
- Providing car recommendations
- Explaining the booking process
- Account and registration help
- General support

## 🔄 Fallback System

If AI providers are unavailable, the chatbot uses intelligent rule-based responses that still provide helpful information about your FleetHub platform.

## 📱 Usage

The chatbot appears as a floating button in the bottom-right corner of all pages. Users can:
1. Click the chat icon to open
2. Type questions or use quick questions
3. Get instant AI-powered responses
4. Close and reopen anytime

## 🛠️ Customization

You can easily customize:
- Chatbot position (bottom-right, bottom-left)
- Quick questions
- Fallback responses
- AI model selection
- Response styling

## 🌍 Global Accessibility

All recommended providers have global CDNs and work worldwide without restrictions.
