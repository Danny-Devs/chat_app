import express from 'express';
import cors from 'cors';
import { config } from './config';
import { chatManager } from './chat';

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS for frontend
app.use(express.json({ limit: '10kb' })); // Parse JSON bodies with size limit
app.use(config.rateLimit); // Apply rate limiting

// Reset endpoint
app.post('/api/chat/reset', (req, res) => {
  chatManager.reset();
  res.json({ success: true });
});

// API Routes
app.post('/api/chat/max-tokens', (req, res) => {
  const maxTokens = parseInt(req.body.maxTokens, 10);
  if (isNaN(maxTokens) || maxTokens <= 0) {
    return res.status(400).json({ error: 'Invalid max tokens value' });
  }
  chatManager.setMaxTokens(maxTokens);
  const newMax = chatManager.getMaxTokens();
  res.json({ maxTokens: newMax });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    // Process message with context and return response
    const result = await chatManager.processMessage(message, context || []);
    res.json(result);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
