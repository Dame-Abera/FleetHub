# 🚗 AI-Powered Car Rental Platform

A modern, full-stack car rental platform with AI integration using LangChain for smart recommendations and customer support.

## Features

### Core Functionality
- 🔍 Smart car search and filtering
- 📅 Real-time availability and booking
- 💳 Secure payment processing (Stripe)
- 👤 User authentication and profiles
- 📊 Admin dashboard for fleet management

### AI Integration
- 🤖 AI chatbot for customer support
- 🎯 Personalized car recommendations
- 🔍 Natural language search
- 💰 Dynamic pricing optimization

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, React Router
- **Backend**: Node.js, Express, MongoDB
- **AI**: LangChain, OpenAI GPT
- **Payment**: Stripe
- **Authentication**: JWT
- **Deployment**: Vercel + Railway

## Quick Start

```bash
# Install dependencies
npm run install-all

# Start development servers
npm run dev
```

## Environment Variables

Create `.env` file in root:
```
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
OPENAI_API_KEY=your_openai_key
```

## Project Structure

```
car-rental-platform/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   └── public/
└── docs/
```