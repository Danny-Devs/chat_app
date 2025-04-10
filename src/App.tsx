import React, { useState, useEffect } from 'react';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { DebugPanel } from './components/DebugPanel';
import { sendMessage, resetChat } from './api';
import type { Message } from './types';
import { useDarkMode } from './hooks/useDarkMode';
import { SunIcon } from './components/icons/SunIcon';
import { MoonIcon } from './components/icons/MoonIcon';
import { InfoIcon } from './components/icons/InfoIcon';

const App: React.FC = () => {
  // App state
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const [context, setContext] = useState<Message[]>([]);
  const { isDark, setIsDark } = useDarkMode();

  // Reset chat context when app mounts
  useEffect(() => {
    resetChat();
    setContext([]);
    setMessages([]);
    setTokenCount(0);
  }, []);

  // Handle new message submission
  const handleSubmit = async (message: string) => {
    if (!message.trim()) return;
    setIsLoading(true);

    const userMessage: Message = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await sendMessage(message);
      console.log('Response from server:', response); // Debug log
      setMessages((prev) => [...prev, response.message]);
      setTokenCount(response.tokenCount);
      setContext(response.context);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900">
      <div className="h-full w-full mx-auto flex">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col max-w-4xl">
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
          <div className="flex-none text-sm text-gray-500 dark:text-gray-400 px-4 py-2 border-t dark:border-gray-700 flex items-center">
            <div className="group relative flex items-center">
              <span className="mr-1">
                <InfoIcon />
              </span>
              <span className="invisible group-hover:visible absolute bottom-full left-0 mb-2 w-60 bg-gray-800 text-white text-xs rounded p-2">
                Token count estimated using 'tiktoken' - may differ from
                official OpenAI API count
              </span>
            </div>
            Token count: {tokenCount}
          </div>
          <MessageInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Debug Panel */}
        <div className="w-96 border-l dark:border-gray-700">
          <DebugPanel context={context} />
        </div>
      </div>
    </div>
  );
};

export default App;
