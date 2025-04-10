import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  openai: {
    model: 'gpt-4',
    maxTokens: 700,
  },
  rateLimit: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
};
