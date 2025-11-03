import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  const logger = new Logger('Bootstrap');
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        'http://localhost:3000', 
        'http://localhost:5173',
        'https://fleethubet.vercel.app',
        'https://frontend-a2vfp59n6-dame-aberas-projects.vercel.app',
        process.env.FRONTEND_URL || 'https://fleethubet.vercel.app'
      ];
      
      // Allow all Vercel preview deployments
      const isVercel = origin.includes('.vercel.app') || origin.includes('vercel.app');
      
      if (allowedOrigins.includes(origin) || isVercel) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: (errors) => {
      logger.error('Validation failed:', errors);
      return errors;
    },
  }));

  // Add global error filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Serve static uploads
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  const config = new DocumentBuilder()
    .setTitle('Car Marketplace API')
    .setDescription('API for car rental and sale marketplace')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚗 Car Marketplace API running on port ${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
}
bootstrap();