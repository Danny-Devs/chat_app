export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: Message;
  tokenCount: number;
  context: Message[];
}
