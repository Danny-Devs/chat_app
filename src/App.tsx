import React, { useState, useEffect } from 'react';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { DebugPanel } from './components/DebugPanel';
import { TokenDisplay } from './components/TokenDisplay';
import { sendMessage, resetChat } from './api';
import type { Message } from './types';
import { useDarkMode } from './hooks/useDarkMode';
import { SunIcon } from './components/icons/SunIcon';
import { MoonIcon } from './components/icons/MoonIcon';
import { ChatLogo } from './components/icons/ChatLogo';
import { InfoIcon } from './components/icons/InfoIcon';

const App: React.FC = () => {
  // App state
  const [messages, setMessages] = useState<Message[]>([]);
  const [context, setContext] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const [maxTokens, setMaxTokens] = useState(200);
  const { isDark, setIsDark } = useDarkMode();

  // Reset chat context when app mounts
  useEffect(() => {
    resetChat();
    setMessages([]);
    setContext([]);
    setTokenCount(0);
  }, []);

  const handleMaxTokensChange = async (newMax: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat/max-tokens`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ maxTokens: Number(newMax) }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMaxTokens(Number(data.maxTokens));
      } else {
        const errorText = await response.text();
        console.error('Failed to update max tokens:', errorText);
      }
    } catch (error) {
      console.error('Failed to update max tokens:', error);
    }
  };

  // Handle new message submission
  const handleSubmit = async (message: string) => {
    if (!message.trim()) return;
    setIsLoading(true);

    const userMessage: Message = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await sendMessage(message, context);
      setMessages((prev) => [...prev, response.message]);
      setContext(response.context);
      setTokenCount(response.tokenCount);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-800">
      <div className="h-full mx-auto max-w-7xl">
        <div className="h-full flex flex-col">
          <header className="flex-none p-4 border-b dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <ChatLogo />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Chat App
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="About"
                >
                  <InfoIcon />
                </button>
                <div className="absolute right-0 w-72 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <p className="mb-2">
                    This chat app uses tiktoken to estimate token counts for
                    OpenAI API interactions.
                  </p>
                  <p className="mb-2">
                    For each user prompt, we send the conversation history to
                    maintain context, but we intelligently prune older messages
                    when the total token count exceeds the limit.
                  </p>
                  <p>
                    This helps optimize API costs while preserving meaningful
                    conversation context.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle dark mode"
              >
                {isDark ? <MoonIcon /> : <SunIcon />}
              </button>
            </div>
          </header>

          <div className="flex-1 flex min-h-0 bg-white dark:bg-gray-900">
            <div className="flex-1 flex flex-col">
              <div className="flex-1 min-h-0">
                <MessageList messages={messages} isLoading={isLoading} />
              </div>
              <TokenDisplay
                currentTokens={tokenCount}
                maxTokens={maxTokens}
                onMaxTokensChange={handleMaxTokensChange}
              />
              <MessageInput onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            <div className="w-96 border-l dark:border-gray-700">
              <DebugPanel context={context} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
