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