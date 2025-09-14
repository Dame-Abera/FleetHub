import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  constructor() {
    console.log('AI Service initialized with NVIDIA support');
  }

  async generateCarDescription(make: string, model: string, year: number, features: string[]): Promise<string> {
    try {
      return await this.enhancedChatbot(
        `Generate a compelling description for a ${year} ${make} ${model} with these features: ${features.join(', ')}. Make it engaging and appealing to potential buyers or renters.`,
        { type: 'description' }
      );
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
    return await this.enhancedChatbot(userMessage, context);
  }

  async recommendCars(userPreferences: {
    budget?: number;
    category?: string;
    purpose?: 'rental' | 'purchase';
    location?: string;
    features?: string[];
  }): Promise<string> {
    const { budget, category, purpose, location, features } = userPreferences;
    
    try {
      return await this.enhancedChatbot(
        `Recommend cars for a user with these preferences:
        - Budget: ${budget ? `$${budget}` : 'No specific budget'}
        - Category: ${category || 'Any category'}
        - Purpose: ${purpose || 'Not specified'}
        - Location: ${location || 'Not specified'}
        - Desired Features: ${features?.join(', ') || 'None specified'}
        
        Provide 3-5 specific recommendations with reasons why each car fits their needs.`,
        { type: 'recommendation' }
      );
    } catch (error) {
      console.error('AI recommendation failed:', error);
      return "I'm having trouble generating recommendations right now. Please try browsing our available cars or contact support.";
    }
  }

  async analyzeMarketTrends(carData: any[]): Promise<string> {
    const dataString = JSON.stringify(carData.slice(0, 10)); // Limit data size
    
    try {
      return await this.enhancedChatbot(
        `Analyze this car marketplace data and provide market insights:
        ${dataString}
        
        Focus on:
        1. Popular car categories
        2. Price trends
        3. Rental vs sale preferences
        4. Geographic patterns
        5. Feature demands`,
        { type: 'analysis' }
      );
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
    try {
      const response = await this.enhancedChatbot(
        `Generate SEO content for this car:
        ${car.year} ${car.brand} ${car.name}
        Category: ${car.category}
        Location: ${car.location}
        Available for: ${car.availableForRental ? 'Rental' : ''} ${car.availableForSale ? 'Sale' : ''}
        
        Return as JSON with title, description, and keywords array.`,
        { type: 'seo' }
      );
      
      const content = JSON.parse(response);
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

  // Enhanced chatbot with NVIDIA AI provider
  async enhancedChatbot(message: string, context?: any): Promise<string> {
    // Try NVIDIA first (fast and reliable)
    try {
      return await this.nvidiaChat(message, context);
    } catch (error) {
      console.warn('NVIDIA failed, using intelligent fallback:', error);
      // Fallback to intelligent rule-based responses
      return this.fallbackChatbot(message, context);
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