import React, { useState } from 'react';
import type { Message } from '../types';

interface DebugPanelProps {
  context?: Message[];
}

interface CollapsibleMessageProps {
  message: Message;
  index: number;
}

const CollapsibleMessage: React.FC<CollapsibleMessageProps> = ({
  message,
  index,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-2 border-b border-gray-700">
      <div
        className="flex items-center cursor-pointer p-2 hover:bg-gray-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="mr-2">{isExpanded ? '▼' : '▶'}</span>
        <span className="text-gray-400">[{index}]</span>
        <span className="ml-2 text-blue-400">{message.role}</span>
      </div>
      {isExpanded && (
        <pre className="p-2 pl-8 text-sm text-gray-300 whitespace-pre-wrap">
          {message.content}
        </pre>
      )}
    </div>
  );
};

export const DebugPanel: React.FC<DebugPanelProps> = ({ context = [] }) => {
  return (
    <div className="h-full bg-gray-900 text-white p-4 overflow-auto">
      <div className="mb-4 flex items-center">
        <h2 className="text-xl font-semibold">Context Debug</h2>
        <span className="ml-2 px-2 py-1 bg-gray-700 rounded-full text-xs">
          {context.length} messages
        </span>
      </div>
      <div>
        {context.map((message, index) => (
          <CollapsibleMessage key={index} message={message} index={index} />
        ))}
      </div>
    </div>
  );
};
