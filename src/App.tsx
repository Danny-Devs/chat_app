import React, { useState } from 'react';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { sendMessage } from './api';
import type { Message } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);

  const handleSubmit = async (message: string) => {
    if (!message.trim()) return;
    setIsLoading(true);

    const userMessage: Message = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await sendMessage(message);
      setMessages((prev) => [...prev, response.message]);
      setTokenCount(response.tokenCount);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col px-4">
        <header className="p-4 border-b dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chat App
          </h1>
        </header>
        <MessageList messages={messages} />
        <div className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2 border-t dark:border-gray-700">
          Token count: {tokenCount}
        </div>
        <MessageInput onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;
