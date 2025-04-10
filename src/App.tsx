import React, { useState } from 'react';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { sendMessage } from './api';
import type { Message } from './types';
import { useDarkMode } from './hooks/useDarkMode';
import { SunIcon } from './components/icons/SunIcon';
import { MoonIcon } from './components/icons/MoonIcon';

const App: React.FC = () => {
  // App state
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const { isDark, setIsDark } = useDarkMode();

  // Handle new message submission
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
    <div className="h-screen bg-white dark:bg-gray-900">
      <div className="h-full w-full max-w-4xl mx-auto flex flex-col">
        <header className="flex-none p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chat App
          </h1>
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle dark mode"
          >
            {isDark ? <MoonIcon /> : <SunIcon />}
          </button>
        </header>
        <div className="flex-1 min-h-0">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>
        <div className="flex-none text-sm text-gray-500 dark:text-gray-400 px-4 py-2 border-t dark:border-gray-700">
          Token count: {tokenCount}
        </div>
        <MessageInput onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;
