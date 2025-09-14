import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, SystemMessage } from 'langchain/schema';

@Injectable()
export class AiService {
  private chatModel?: ChatOpenAI;

  constructor() {
    const key = process.env.OPENAI_API_KEY;
    if (key && key.trim().length > 0) {
      this.chatModel = new ChatOpenAI({
        openAIApiKey: key,
        temperature: 0.7,
      });
    } else {
      // No API key provided: run in fallback mode without blocking app startup
      console.warn('AI disabled: OPENAI_API_KEY not set. Using local fallbacks.');
    }
  }

  async generateCarDescription(make: string, model: string, year: number, features: string[]): Promise<string> {
    if (!this.chatModel) {
      return `Beautiful ${year} ${make} ${model} with excellent features including ${features.join(', ')}. Perfect for your transportation needs.`;
    }
    const systemMessage = new SystemMessage(
      'You are a professional car salesperson. Generate an engaging, detailed description for a car listing that highlights key features and appeals to potential buyers or renters.'
    );
    
    const humanMessage = new HumanMessage(
      `Generate a compelling description for a ${year} ${make} ${model} with these features: ${features.join(', ')}`
    );

    try {
      const response = await this.chatModel.call([systemMessage, humanMessage]);
      return response.content as string;
    } catch (error) {
      console.error('AI description generation failed:', error);
      return `Beautiful ${year} ${make} ${model} with excellent features including ${features.join(', ')}. Perfect for your transportation needs.`;
    }
  }

  async suggestCarPrice(make: string, model: string, year: number, mileage: number, type: 'rental' | 'sale'): Promise<number> {
    // This would typically integrate with market data APIs
    // For now, using a simple algorithm as a placeholder
    const basePrice = this.getBasePriceByMake(make);
    const yearFactor = Math.max(0.5, 1 - (2024 - year) * 0.05);
    const mileageFactor = Math.max(0.6, 1 - (mileage / 100000) * 0.3);
    
    let suggestedPrice = basePrice * yearFactor * mileageFactor;
    
    if (type === 'rental') {
      suggestedPrice = suggestedPrice * 0.001; // Daily rate approximation
    }
    
    return Math.round(suggestedPrice);
  }

  async generateChatResponse(userMessage: string, context?: any): Promise<string> {
    if (!this.chatModel) {
      return "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact our support team.";
    }
    const systemMessage = new SystemMessage(
      'You are a helpful car marketplace assistant. Help users with questions about cars, rentals, purchases, and general automotive advice. Be friendly and informative.'
    );
    
    const humanMessage = new HumanMessage(userMessage);

    try {
      const response = await this.chatModel.call([systemMessage, humanMessage]);
      return response.content as string;
    } catch (error) {
      console.error('AI chat response failed:', error);
      return "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact our support team.";
    }
  }

  async recommendCars(userPreferences: {
    budget?: number;
    category?: string;
    purpose?: 'rental' | 'purchase';
    location?: string;
    features?: string[];
  }): Promise<string> {
    if (!this.chatModel) {
      return "I'm having trouble generating recommendations right now. Please try browsing our available cars or contact support.";
    }
    const { budget, category, purpose, location, features } = userPreferences;
    
    const systemMessage = new SystemMessage(
      'You are an expert car recommendation engine. Analyze user preferences and provide personalized car recommendations with detailed explanations.'
    );
    
    const humanMessage = new HumanMessage(
      `Recommend cars for a user with these preferences:
      - Budget: ${budget ? `$${budget}` : 'No specific budget'}
      - Category: ${category || 'Any category'}
      - Purpose: ${purpose || 'Not specified'}
      - Location: ${location || 'Not specified'}
      - Desired Features: ${features?.join(', ') || 'None specified'}
      
      Provide 3-5 specific recommendations with reasons why each car fits their needs.`
    );

    try {
      const response = await this.chatModel.call([systemMessage, humanMessage]);
      return response.content as string;
    } catch (error) {
      console.error('AI recommendation failed:', error);
      return "I'm having trouble generating recommendations right now. Please try browsing our available cars or contact support.";
    }
  }

  async analyzeMarketTrends(carData: any[]): Promise<string> {
    if (!this.chatModel) {
      return "Market analysis is currently unavailable. Our team is working to restore this feature.";
    }
    const systemMessage = new SystemMessage(
      'You are a market analyst specializing in automotive trends. Analyze car marketplace data and provide insights.'
    );
    
    const dataString = JSON.stringify(carData.slice(0, 10)); // Limit data size
    
    const humanMessage = new HumanMessage(
      `Analyze this car marketplace data and provide market insights:
      ${dataString}
      
      Focus on:
      1. Popular car categories
      2. Price trends
      3. Rental vs sale preferences
      4. Geographic patterns
      5. Feature demands`
    );

    try {
      const response = await this.chatModel.call([systemMessage, humanMessage]);
      return response.content as string;
    } catch (error) {
      console.error('Market analysis failed:', error);
      return "Market analysis is currently unavailable. Our team is working to restore this feature.";
    }
  }

  async generateSEOContent(car: any): Promise<{
    title: string;
    description: string;
    keywords: string[];
  }> {
    if (!this.chatModel) {
      return {
        title: `${car.year} ${car.brand} ${car.name} - ${car.availableForRental ? 'Rental' : 'Sale'}`,
        description: car.description || `${car.year} ${car.brand} ${car.name} available for ${car.availableForRental ? 'rental' : 'sale'} in ${car.location}`,
        keywords: [car.brand, car.category, car.location, 'car', car.availableForRental ? 'rental' : 'sale'].filter(Boolean)
      };
    }
    const systemMessage = new SystemMessage(
      'You are an SEO expert. Generate optimized titles, descriptions, and keywords for car listings to improve search visibility.'
    );
    
    const humanMessage = new HumanMessage(
      `Generate SEO content for this car:
      ${car.year} ${car.brand} ${car.name}
      Category: ${car.category}
      Location: ${car.location}
      Available for: ${car.availableForRental ? 'Rental' : ''} ${car.availableForSale ? 'Sale' : ''}
      
      Return as JSON with title, description, and keywords array.`
    );

    try {
      const response = await this.chatModel.call([systemMessage, humanMessage]);
      const content = JSON.parse(response.content as string);
      return {
        title: content.title || `${car.year} ${car.brand} ${car.name}`,
        description: content.description || car.description,
        keywords: content.keywords || [car.brand, car.category, car.location].filter(Boolean)
      };
    } catch (error) {
      console.error('SEO generation failed:', error);
      return {
        title: `${car.year} ${car.brand} ${car.name} - ${car.availableForRental ? 'Rental' : 'Sale'}`,
        description: car.description || `${car.year} ${car.brand} ${car.name} available for ${car.availableForRental ? 'rental' : 'sale'} in ${car.location}`,
        keywords: [car.brand, car.category, car.location, 'car', car.availableForRental ? 'rental' : 'sale'].filter(Boolean)
      };
    }
  }

  // Enhanced chatbot with multiple AI providers
  async enhancedChatbot(message: string, context?: any): Promise<string> {
    // Try NVIDIA first (fast and reliable)
    try {
      return await this.nvidiaChat(message, context);
    } catch (error) {
      console.warn('NVIDIA failed, trying Hugging Face:', error);
      // Try Hugging Face as fallback
    try {
      return await this.huggingFaceChat(message, context);
      } catch (hfError) {
        console.warn('Hugging Face also failed, using intelligent fallback:', hfError);
        // Fallback to intelligent rule-based responses
      return this.fallbackChatbot(message, context);
      }
    }
  }

  private async nvidiaChat(message: string, context?: any): Promise<string> {
    const apiKey =process.env.NVIDIA_API_KEY;
    
    if (!apiKey) {
      throw new Error('NVIDIA API key not configured');
    }

    try {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta/llama-4-maverick-17b-128e-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful car marketplace assistant for FleetHub. Help users with questions about cars, rentals, purchases, and general automotive advice. Be friendly, informative, and concise. Keep responses under 150 words.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 150,
          temperature: 0.7,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        })
      });

      if (!response.ok) {
        throw new Error(`NVIDIA API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
      }
      
      throw new Error('No response from NVIDIA API');
    } catch (error) {
      console.error('NVIDIA API error:', error);
      throw error;
    }
  }

  private async huggingFaceChat(message: string, context?: any): Promise<string> {
    const apiKey = process.env.HUGGING_FACE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    // First, let's test if the API key works with a simple model
    console.log('Testing Hugging Face API key...');
    console.log('API Key present:', !!apiKey);
    console.log('API Key length:', apiKey ? apiKey.length : 0);

    // Try multiple models in order of preference - using models that are known to work with Inference API
    const models = [
      "gpt2",                            // Simple GPT-2 model
      "openai-community/gpt2",           // Full path to GPT-2
      "distilgpt2",                      // Smaller GPT-2
      "distilbert/distilgpt2",           // Full path to DistilGPT-2
      "microsoft/DialoGPT-small",        // Conversational model
      "facebook/blenderbot-400M-distill" // Another conversational option
    ];

    for (const model of models) {
      try {
        console.log(`Trying Hugging Face model: ${model}`);
    
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: message,
        parameters: {
              max_length: 60,
          temperature: 0.7,
          do_sample: true,
              return_full_text: false,
        }
      })
    });

        console.log(`Response status for ${model}: ${response.status}`);

    if (!response.ok) {
          const errorText = await response.text();
          console.error(`Model ${model} failed: ${response.status} - ${errorText}`);
          continue;
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
          const generatedText = data[0].generated_text;
          if (generatedText && generatedText.trim().length > 0) {
            // Clean up the response and make it more conversational
            const cleanResponse = generatedText.replace(message, '').trim();
            if (cleanResponse.length > 0) {
              console.log(`Successfully used model: ${model}`);
              return cleanResponse;
            }
          }
        }
      } catch (error) {
        console.warn(`Model ${model} failed with error:`, error);
        continue; // Try next model
      }
    }
    
    // If all models fail, use fallback
    console.log('All Hugging Face models failed, using fallback');
    return this.fallbackChatbot(message, context);
  }

  private fallbackChatbot(message: string, context?: any): string {
    const lowerMessage = message.toLowerCase();
    
    // Car-related responses
    if (lowerMessage.includes('car') || lowerMessage.includes('vehicle')) {
      if (lowerMessage.includes('rent') || lowerMessage.includes('rental')) {
        return "I can help you find the perfect rental car! What type of vehicle are you looking for? SUV, sedan, or something else?";
      }
      if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('sale')) {
        return "Great! I can help you find cars for sale. What's your budget range and preferred car type?";
      }
      if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "Our cars are competitively priced! You can filter by price range on our cars page. What's your budget?";
      }
      return "I'd be happy to help you with car-related questions! Are you looking to rent or buy a vehicle?";
    }
    
    // General greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! 👋 Welcome to FleetHub! I'm here to help you find the perfect car. How can I assist you today?";
    }
    
    // Help requests
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help! I can assist you with:\n• Finding cars to rent or buy\n• Answering questions about our platform\n• Providing car recommendations\n\nWhat would you like to know?";
    }
    
    // Booking questions
    if (lowerMessage.includes('book') || lowerMessage.includes('reserve')) {
      return "To book a car, simply click on any car listing and use the 'Book Now' button. You'll need to create an account first if you haven't already!";
    }
    
    // Account questions
    if (lowerMessage.includes('account') || lowerMessage.includes('login') || lowerMessage.includes('register')) {
      return "You can create an account by clicking 'Register' in the top menu, or login if you already have one. It's free and takes just a minute!";
    }
    
    // Default response
    return "I'm here to help with your car rental and purchase needs! Feel free to ask me about our cars, booking process, or anything else related to FleetHub. What can I help you with?";
  }

  private getBasePriceByMake(make: string): number {
    const basePrices: { [key: string]: number } = {
      'toyota': 25000,
      'honda': 24000,
      'ford': 28000,
      'chevrolet': 27000,
      'bmw': 45000,
      'mercedes': 50000,
      'audi': 47000,
      'lexus': 42000,
      'nissan': 23000,
      'hyundai': 22000,
    };
    
    return basePrices[make.toLowerCase()] || 25000;
  }
}