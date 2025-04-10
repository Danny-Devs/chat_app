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
    // Add user message to context
    this.context.push({ role: 'user', content: userMessage });

    // Get response from OpenAI
    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: this.context,
    });

    // Add assistant's response to context
    const assistantMessage = response.choices[0].message as Message;
    this.context.push(assistantMessage);

    // Check and trim context if needed
    const tokenCount = this.getTokenCount();
    this.trimContext(tokenCount);

    return { message: assistantMessage, tokenCount };
  }

  /**
   * Calculate total tokens in current context
   */
  private getTokenCount(): number {
    return encoder.encode(this.context.map((m) => m.content).join('\n')).length;
  }

  /**
   * Trim context by removing oldest message pairs
   * Keeps system message and at least one exchange
   */
  private trimContext(tokenCount: number): void {
    while (tokenCount > config.openai.maxTokens && this.context.length > 3) {
      this.context.splice(1, 2); // Remove oldest user-assistant pair
    }
  }
}

// Export singleton instance
export const chatManager = new ChatManager();
