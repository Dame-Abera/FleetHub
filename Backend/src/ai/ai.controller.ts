import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @ApiOperation({ summary: 'AI Chat Assistant' })
  async chat(@Body() body: { message: string; context?: any }) {
    const response = await this.aiService.enhancedChatbot(body.message, body.context);
    return { response };
  }

  @Post('recommend')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get AI car recommendations' })
  async recommend(@Body() preferences: {
    budget?: number;
    category?: string;
    purpose?: 'rental' | 'purchase';
    location?: string;
    features?: string[];
  }) {
    const recommendations = await this.aiService.recommendCars(preferences);
    return { recommendations };
  }

  @Post('generate-description')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate AI car description' })
  async generateDescription(@Body() carData: {
    make: string;
    model: string;
    year: number;
    features: string[];
  }) {
    const description = await this.aiService.generateCarDescription(
      carData.make,
      carData.model,
      carData.year,
      carData.features
    );
    return { description };
  }

  @Post('suggest-price')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get AI price suggestions' })
  async suggestPrice(@Body() carData: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    type: 'rental' | 'sale';
  }) {
    const price = await this.aiService.suggestCarPrice(
      carData.make,
      carData.model,
      carData.year,
      carData.mileage,
      carData.type
    );
    return { suggestedPrice: price };
  }

  @Get('market-trends')
  @ApiOperation({ summary: 'Get AI market analysis' })
  async getMarketTrends(@Query('limit') limit: string = '50') {
    // In a real implementation, you'd fetch actual car data
    // For demo purposes, we'll use sample data
    const sampleData = [
      { brand: 'Toyota', category: 'Sedan', price: 25000, location: 'NY' },
      { brand: 'Honda', category: 'SUV', price: 30000, location: 'CA' },
      // Add more sample data...
    ];
    
    const analysis = await this.aiService.analyzeMarketTrends(sampleData);
    return { analysis };
  }

  @Get('test')
  @ApiOperation({ summary: 'Test AI service connection' })
  async testAiService() {
    try {
      const response = await this.aiService.enhancedChatbot('Hello, test message');
      return { 
        status: 'success', 
        message: 'AI service is working',
        response,
        hasNvidiaKey: !!process.env.NVIDIA_API_KEY,
        provider: process.env.NVIDIA_API_KEY ? 'NVIDIA' : 'Fallback'
      };
    } catch (error) {
      return { 
        status: 'error', 
        message: 'AI service test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        hasNvidiaKey: !!process.env.NVIDIA_API_KEY,
        provider: 'Fallback'
      };
    }
  }

  @Get('test-nvidia')
  @ApiOperation({ summary: 'Test NVIDIA API directly' })
  async testNvidia() {
    const apiKey = process.env.NVIDIA_API_KEY;
    
    if (!apiKey) {
      return { 
        status: 'error', 
        message: 'No NVIDIA API key found',
        hasApiKey: false
      };
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
              role: 'user',
              content: 'Hello, test message',
            }
          ],
          max_tokens: 50,
          temperature: 0.7,
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          status: 'success',
          message: 'NVIDIA API is working',
          statusCode: response.status,
          hasApiKey: true,
          apiKeyLength: apiKey.length,
          response: data.choices?.[0]?.message?.content || 'No content',
          model: data.model || 'meta/llama-4-maverick-17b-128e-instruct'
        };
      } else {
        return {
          status: 'error',
          message: 'NVIDIA API failed',
          statusCode: response.status,
          hasApiKey: true,
          apiKeyLength: apiKey.length
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'NVIDIA API test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        hasApiKey: true,
        apiKeyLength: apiKey.length
      };
    }
  }

}
