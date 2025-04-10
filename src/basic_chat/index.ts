import { OpenAI } from 'openai';
import { encoding_for_model } from 'tiktoken';

const openai = new OpenAI();
const MAX_TOKENS = 700;
const encoder = encoding_for_model('gpt-4o');
const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content: 'You are a helpful chatbot.',
  },
];

async function createChatCompletion() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: context,
    });
    const responseMessage = response.choices[0].message;
    console.log(`${responseMessage.role}: ${responseMessage.content}`);

    // Add assistant's response to context
    context.push(responseMessage);

    // Check token count after adding both user and assistant messages
    let tokenCount = encoder.encode(
      context.map((m) => m.content).join('\n')
    ).length;
    console.log('tokenCount', tokenCount);

    // Remove pairs of messages (user + assistant) to maintain conversation flow
    while (tokenCount > MAX_TOKENS && context.length > 3) {
      // Keep system message + at least one exchange
      // Remove the oldest user-assistant pair (indices 1 and 2)
      context.splice(1, 2);
      tokenCount = encoder.encode(
        context.map((m) => m.content).join('\n')
      ).length;
    }
  } catch (error) {
    console.error('Error in chat completion:', error);
  }
}

process.stdin.on('data', async (data) => {
  try {
    // data is a Buffer containing raw input from stdin
    // toString() converts Buffer to string, trim() removes whitespace
    const prompt = data.toString().trim();
    context.push({ role: 'user', content: prompt });
    await createChatCompletion();
  } catch (error) {
    console.error('Error processing input:', error);
  }
});

async function main() {
  console.log('Chat started. Type your message and press Enter.');
}

// Start the application
main().catch((error) => {
  console.error('Application error:', error);
  process.exit(1);
});
