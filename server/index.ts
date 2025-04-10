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
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    // Process message and return response
    const result = await chatManager.processMessage(message);
    console.log('Server sending result:', result); // Debug log
    console.log('Context array exists:', Array.isArray(result.context)); // Debug log
    console.log('Context length:', result.context?.length); // Debug log
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
