import { OpenAI } from 'openai';
import { encoding_for_model } from 'tiktoken';
import { config } from './config';

// Initialize OpenAI client
const openai = new OpenAI();
let MAX_TOKENS = config.openai.defaultContextTokens;

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
  private systemMessage: Message = {
    role: 'system',
    content: 'You are a helpful AI assistant.',
  };

  reset() {
    MAX_TOKENS = config.openai.defaultContextTokens;
  }

  setMaxTokens(newMax: number) {
    MAX_TOKENS = newMax;
  }

  getMaxTokens() {
    return MAX_TOKENS;
  }

  private countTokens(messages: Message[]): number {
    const encoder = encoding_for_model('gpt-4o');
    let totalTokens = 0;

    for (const msg of messages) {
      // Count tokens for role
      totalTokens += encoder.encode(msg.role).length;
      // Count tokens for content
      totalTokens += encoder.encode(msg.content).length;
      // Add 4 tokens for message overhead (2 for role, 2 for content formatting)
      totalTokens += 4;
    }
    // Add 2 tokens for conversation overhead
    totalTokens += 2;

    return totalTokens;
  }

  /**
   * Process a user message and return assistant's response
   * Handles context management and token counting
   */
  async processMessage(
    userMessage: string,
    clientContext: Message[] = []
  ): Promise<{
    message: Message;
    tokenCount: number;
    context: Message[];
  }> {
    // Add new message to client context
    const newMessage: Message = { role: 'user', content: userMessage };
    let context: Message[] = [...clientContext, newMessage];

    // Send full context to OpenAI including system message
    const fullContext = [this.systemMessage, ...context];

    // Get OpenAI response
    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: fullContext,
    });

    const assistantMessage: Message = {
      role: 'assistant',
      content: response.choices[0].message.content || '',
    };

    // Add assistant's response to context
    context = [...context, assistantMessage];

    // NOW check tokens and trim if needed
    let tokenCount = this.countTokens([this.systemMessage, ...context]);

    // If over token limit, remove oldest user-assistant pairs until under limit
    while (tokenCount > MAX_TOKENS && context.length >= 2) {
      // Remove oldest user-assistant pair
      context.splice(0, 2);
      tokenCount = this.countTokens([this.systemMessage, ...context]);
    }

    return {
      message: assistantMessage,
      tokenCount,
      context: [this.systemMessage, ...context],
    };
  }
}

// Export singleton instance
export const chatManager = new ChatManager();
