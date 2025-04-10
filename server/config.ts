import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load environment variables from .env file
dotenv.config();

/**
 * Central configuration object for the application
 * Contains all configurable parameters in one place
 */
export const config = {
  port: process.env.PORT || 3000,
  openai: {
    model: 'gpt-4',
    maxTokens: 700, // Maximum tokens to keep in conversation context
    defaultContextTokens: 200, // Default token limit for conversation context
  },
  rateLimit: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
  }),
};
