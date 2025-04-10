import { OpenAI } from 'openai';
import { encoding_for_model } from 'tiktoken';
import { config } from './config';

const openai = new OpenAI();
const encoder = encoding_for_model('gpt-4');

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class ChatManager {
  private context: Message[] = [
    {
      role: 'system',
      content: 'You are a helpful chatbot.',
    },
  ];

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

    const tokenCount = this.getTokenCount();
    this.trimContext(tokenCount);

    return { message: assistantMessage, tokenCount };
  }

  private getTokenCount(): number {
    return encoder.encode(this.context.map((m) => m.content).join('\n')).length;
  }

  private trimContext(tokenCount: number): void {
    while (tokenCount > config.openai.maxTokens && this.context.length > 3) {
      this.context.splice(1, 2);
    }
  }
}

export const chatManager = new ChatManager();
