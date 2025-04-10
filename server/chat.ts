import { OpenAI } from 'openai';
import { encoding_for_model } from 'tiktoken';
import { config } from './config';

// Initialize OpenAI client and tokenizer
const openai = new OpenAI();
const MAX_TOKENS = 100;

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

    // Get assistant response
    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: this.context,
    });

    const assistantMessage = response.choices[0].message as Message;
    this.context.push(assistantMessage);

    // Create new encoder each time like in basic_chat
    let tokenCount = encoding_for_model('gpt-4o').encode(
      this.context.map((m) => m.content).join('\n')
    ).length;

    // Trim old message pairs while context is too big
    while (tokenCount > MAX_TOKENS) {
      // Remove oldest user+assistant pair, keeping system message
      this.context.splice(1, 2);
      // Recount tokens after trimming
      tokenCount = encoding_for_model('gpt-4o').encode(
        this.context.map((m) => m.content).join('\n')
      ).length;
    }

    // Return assistant's message and TOTAL context tokens
    return { message: assistantMessage, tokenCount };
  }
}

// Export singleton instance
export const chatManager = new ChatManager();
