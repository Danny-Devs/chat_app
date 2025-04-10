import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { OpenAI } from 'openai';
import { encoding_for_model } from 'tiktoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const openai = new OpenAI();
const encoder = encoding_for_model('gpt-4');
const MAX_TOKENS = 700;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
});

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(limiter);

const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content: 'You are a helpful chatbot.',
  },
];

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    context.push({ role: 'user', content: userMessage });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: context,
    });

    const assistantMessage = response.choices[0].message;
    context.push(assistantMessage);

    const tokenCount = encoder.encode(
      context.map((m) => m.content).join('\n')
    ).length;

    // Remove pairs of messages if we exceed token limit
    while (tokenCount > MAX_TOKENS && context.length > 3) {
      context.splice(1, 2);
    }

    res.json({
      message: assistantMessage,
      tokenCount,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
