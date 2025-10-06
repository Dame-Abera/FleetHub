#!/usr/bin/env ts-node

/**
 * Development Database Seeding Script
 * 
 * This script seeds the database with sample data for development.
 * Run with: yarn db:seed:dev
 */

import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDevelopment() {
  console.log('🌱 Starting development database seeding...');
  
  try {
    // Check if database is accessible
    await prisma.$connect();
    console.log('✅ Database connection established');
    
    // Run the main seed script
    console.log('📦 Running main seed script...');
    execSync('yarn db:seed', { stdio: 'inherit', cwd: process.cwd() });
    
    console.log('🎉 Development seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Development seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedDevelopment();
}

export { seedDevelopment };

