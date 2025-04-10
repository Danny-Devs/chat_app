import React, { useState, FormEvent, useMemo } from 'react';

interface MessageInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [input, setInput] = useState('');
  const [touched, setTouched] = useState(false);

  const isValid = useMemo(() => input.trim().length > 0, [input]);
  const showError = touched && !isValid && !isLoading;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isValid && !isLoading) {
      onSubmit(input);
      setInput('');
      setTouched(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Type a message..."
            disabled={isLoading}
            aria-invalid={showError}
            className={`flex-1 p-2 rounded-lg border ${
              showError ? 'border-red-500' : 'dark:border-gray-700'
            } dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 ${
              showError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
          />
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
        {showError && (
          <p className="text-red-500 text-sm">Please enter a message</p>
        )}
      </div>
    </form>
  );
};
