import React, { useState } from 'react';
import { InfoIcon } from './icons/InfoIcon';

interface TokenDisplayProps {
  currentTokens: number;
  maxTokens: number;
  onMaxTokensChange: (newMax: number) => void;
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({
  currentTokens,
  maxTokens,
  onMaxTokensChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(maxTokens.toString());

  const handleSubmit = () => {
    const newMax = parseInt(editValue, 10);
    if (!isNaN(newMax) && newMax > 0) {
      onMaxTokensChange(newMax);
    } else {
      setEditValue(maxTokens.toString());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex-none text-sm text-gray-500 dark:text-gray-400 px-4 py-2 border-t dark:border-gray-700 flex items-center justify-between">
      <div className="flex items-center">
        <div className="group relative flex items-center">
          <span className="mr-1">
            <InfoIcon />
          </span>
          <span className="invisible group-hover:visible absolute bottom-full left-0 mb-2 w-60 bg-gray-800 text-white text-xs rounded p-2">
            Token count estimated using 'tiktoken' - may differ from official
            OpenAI API count
          </span>
        </div>
        <span>Token count: {currentTokens}</span>
      </div>

      <div className="flex items-center">
        <span className="mr-2">Max tokens:</span>
        {isEditing ? (
          <div className="flex items-center">
            <input
              type="number"
              className="w-20 px-2 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
                if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditValue(maxTokens.toString());
                }
              }}
              autoFocus
            />
            <button
              onClick={handleSubmit}
              className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="group flex items-center"
          >
            <span className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              {maxTokens}
            </span>
            <svg
              className="w-3.5 h-3.5 ml-1 text-gray-400 group-hover:text-blue-500 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
