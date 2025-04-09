import { OpenAI } from 'openai';
import { encoding_for_model } from 'tiktoken';

const openai = new OpenAI();
const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content: 'You are a helpful chatbot.',
  },
];

async function createChatCompletion() {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: context,
  });
  const responseMessage = response.choices[0].message;
  console.log(`${responseMessage.role}: ${responseMessage.content}`);

  // delete older messages if context is too long in terms of tokens
  const MAX_TOKENS = 100;
  let tokenCount = encoding_for_model('gpt-4o').encode(
    context.map((m) => m.content).join('\n')
  ).length;
  console.log('tokenCount', tokenCount);
  while (tokenCount > MAX_TOKENS) {
    // delete the first 2 messages, except the system message
    context.splice(1, 2);
    tokenCount = encoding_for_model('gpt-4o').encode(
      context.map((m) => m.content).join('\n')
    ).length;
  }
  console.log('context', context);
}

process.stdin.on('data', async (data) => {
  // data is a Buffer containing raw input from stdin
  // toString() converts Buffer to string, trim() removes whitespace
  const prompt = data.toString().trim();
  context.push({ role: 'user', content: prompt });
  await createChatCompletion();
});

async function main() {}
