# 🤖 AI Chatbot Setup Guide

## Free AI Providers for Your FleetHub Chatbot

### 🥇 **NVIDIA (Recommended)**
- **Free tier**: Generous free credits
- **Global access**: ✅ Yes
- **Speed**: Very fast
- **Models**: Llama-4-Maverick, Llama-3.1, Mistral
- **Quality**: Excellent for conversations

**How to get API key:**
1. Go to [build.nvidia.com](https://build.nvidia.com)
2. Create free account
3. Go to API Keys section
4. Create new key
5. Copy the key (starts with nvapi-)

### 🥈 **Hugging Face (Alternative)**
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


## 🔧 Environment Setup

Add to your `.env` file in the Backend folder:

```bash
# Choose one or more AI providers (NVIDIA recommended)
NVIDIA_API_KEY="your-nvidia-api-key-here"
HUGGING_FACE_API_KEY="your-hugging-face-api-key-here"
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
