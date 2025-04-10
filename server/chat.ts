import { OpenAI } from 'openai';
import { encoding_for_model } from 'tiktoken';
import { config } from './config';

// Initialize OpenAI client
const openai = new OpenAI();
const MAX_TOKENS = 1000;

/**
 * Message interface representing a chat message
 * Used throughout the application for type safety
 */
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * ChatManager class handles all chat-related operations
 * Manages conversation context and token limits
 */
class ChatManager {
  // Initialize context with system message
  private context: Message[] = [
    {
      role: 'system',
      content: 'You are a helpful chatbot.',
    },
  ];

  // Reset context to initial state
  reset() {
    this.context = [
      {
        role: 'system',
        content: 'You are a helpful chatbot.',
      },
    ];
  }

  /**
   * Process a user message and return assistant's response
   * Handles context management and token counting
   */
  async processMessage(
    userMessage: string
  ): Promise<{ message: Message; tokenCount: number; context: Message[] }> {
    // Add user message to context
    this.context.push({ role: 'user', content: userMessage });

    // Get OpenAI response
    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: this.context,
    });

    const assistantMessage = response.choices[0].message as Message;
    this.context.push(assistantMessage);

    // Count tokens in entire context
    let tokenCount = encoding_for_model('gpt-4o').encode(
      this.context.map((m) => m.content).join('\n')
    ).length;

    // Remove oldest message pairs if context is too large
    while (tokenCount > MAX_TOKENS) {
      this.context.splice(1, 2); // Keep system message, remove user+assistant pair
      tokenCount = encoding_for_model('gpt-4o').encode(
        this.context.map((m) => m.content).join('\n')
      ).length;
    }

    return {
      message: assistantMessage,
      tokenCount,
      context: [...this.context],
    };
  }
}

// Export singleton instance
export const chatManager = new ChatManager();
