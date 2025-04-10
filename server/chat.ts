import { OpenAI } from 'openai';
import { encoding_for_model } from 'tiktoken';
import { config } from './config';

// Initialize OpenAI client and tokenizer
const openai = new OpenAI();
const encoder = encoding_for_model('gpt-4');

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
  // Initialize with system message
  private context: Message[] = [
    {
      role: 'system',
      content: 'You are a helpful chatbot.',
    },
  ];

  /**
   * Process a user message and return assistant's response
   * Handles context management and token counting
   */
  async processMessage(
    userMessage: string
  ): Promise<{ message: Message; tokenCount: number }> {
    this.context.push({ role: 'user', content: userMessage });

    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: this.context,
    });

    const assistantMessage = response.choices[0].message as Message;
    this.context.push(assistantMessage);

    // Simple token counting - just the message contents
    const tokenCount = encoder.encode(
      userMessage + assistantMessage.content
    ).length;

    // Trim old messages if context gets too long
    if (this.context.length > 10) {
      this.context.splice(1, 2);
    }

    return { message: assistantMessage, tokenCount };
  }
}

// Export singleton instance
export const chatManager = new ChatManager();
