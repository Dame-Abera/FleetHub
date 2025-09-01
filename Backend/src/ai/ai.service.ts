import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, SystemMessage } from 'langchain/schema';

@Injectable()
export class AiService {
  private chatModel: ChatOpenAI;

  constructor() {
    this.chatModel = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.7,
    });
  }

  async generateCarDescription(make: string, model: string, year: number, features: string[]): Promise<string> {
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