import { useState } from 'react';
import { sendMessage } from './api';

interface Message {
  role: string;
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [tokenCount, setTokenCount] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setInput('');

    try {
      const { message, tokenCount } = await sendMessage(input);
      setMessages((prev) => [...prev, message]);
      setTokenCount(tokenCount);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          height: '500px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: '#f9f9f9',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: '10px',
              textAlign: msg.role === 'user' ? 'right' : 'left',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: msg.role === 'user' ? '#007bff' : '#e9ecef',
                color: msg.role === 'user' ? 'white' : 'black',
                maxWidth: '80%',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginBottom: '10px',
          color: '#666',
          fontSize: '14px',
        }}
      >
        Tokens used: {tokenCount}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            fontSize: '16px',
          }}
          placeholder="Type a message..."
        />
      </form>
    </div>
  );
}

export default App;
