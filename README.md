# AI Chat Application

A modern web application that provides a chat interface powered by OpenAI's GPT-4. Built with React, TypeScript, and Express.

## Architecture

### Frontend (React + Vite)

- **Technology Stack**: React, TypeScript, Vite
- **Key Components**:
  - `App.tsx`: Main chat interface with message history and input form
  - `api.ts`: API client for backend communication
- **Features**:
  - Real-time message display
  - Token usage tracking
  - Responsive design with inline styles

### Backend (Express + TypeScript)

- **Technology Stack**: Express, TypeScript, OpenAI API
- **Key Components**:
  - `config.ts`: Centralized configuration management
  - `chat.ts`: Chat logic and context management
  - `index.ts`: Express server and API routes
- **Features**:
  - Rate limiting
  - CORS protection
  - Token-based context management
  - Error handling

## Technical Implementation

### Context Management

- Uses a sliding window approach for conversation context
- Maintains token count below configurable limit (700 tokens)
- Preserves system message while trimming older exchanges

### Security

- API key stored securely in environment variables
- Rate limiting: 100 requests per 15 minutes per IP
- Request size limits: 10kb per request
- CORS protection for frontend-backend communication

### Performance

- Efficient token counting using tiktoken
- Minimal dependencies
- No database required (in-memory context)

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   VITE_API_URL=http://localhost:3000
   ```

### Development

1. Start the backend server:
   ```bash
   npm run server
   ```
2. Start the frontend development server:
   ```bash
   npm run dev
   ```

### Deployment

- Frontend: Deploy to Netlify
- Backend: Deploy to Render.com
- Update environment variables in deployment platforms

## API Endpoints

### POST /api/chat

- **Request Body**: `{ message: string }`
- **Response**:
  ```typescript
  {
    message: {
      role: 'assistant',
      content: string
    },
    tokenCount: number
  }
  ```

## Code Structure

```
chat-app/
├── src/                  # Frontend code
│   ├── App.tsx          # Main React component
│   ├── api.ts           # API client
│   └── main.tsx         # Entry point
├── server/              # Backend code
│   ├── config.ts        # Configuration
│   ├── chat.ts          # Chat logic
│   └── index.ts         # Express server
├── package.json         # Dependencies
└── .env                 # Environment variables
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC
