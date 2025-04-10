interface ChatResponse {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
  tokenCount: number;
}

export async function sendMessage(message: string): Promise<ChatResponse> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}
