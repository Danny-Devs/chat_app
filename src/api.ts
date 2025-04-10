import { ChatResponse } from './types';

export class ChatError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ChatError';
  }
}

export async function sendMessage(message: string): Promise<ChatResponse> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new ChatError(429, 'Rate limit exceeded. Please wait a moment.');
      }
      if (response.status === 503) {
        throw new ChatError(503, 'AI service is temporarily unavailable.');
      }
      throw new ChatError(response.status, 'Failed to send message');
    }

    return response.json();
  } catch (error) {
    if (error instanceof ChatError) throw error;
    throw new ChatError(500, 'Network error or service unavailable');
  }
}
