import React from 'react';
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
}) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`
              flex flex-col
              ${message.role === 'assistant' ? 'items-start' : 'items-end'}
            `}
          >
            <div
              className={`
                max-w-[80%] rounded-lg px-4 py-2
                ${
                  message.role === 'assistant'
                    ? 'bg-gray-200 dark:bg-gray-800'
                    : 'bg-blue-500 text-white'
                }
              `}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-4 py-2">
              <div className="animate-pulse">Thinking...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
