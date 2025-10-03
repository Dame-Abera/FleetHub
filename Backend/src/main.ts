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
    origin: [
      'http://localhost:3000', 
      'http://localhost:5173',
      'https://fleethubet.vercel.app',
      'https://frontend-a2vfp59n6-dame-aberas-projects.vercel.app',
      process.env.FRONTEND_URL || 'https://fleethubet.vercel.app'
    ],
    credentials: true,
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