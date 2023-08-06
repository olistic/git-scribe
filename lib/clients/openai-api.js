import fetch from 'node-fetch';

import { OPENAI_API_BASE_URL } from '../constants/index.js';
import { getOpenAIAPIKey } from '../utils/get-openai-api-key.js';

const model = 'gpt-3.5-turbo';

export async function createChatCompletion(messages) {
  const apiKey = await getOpenAIAPIKey();

  const response = await fetch(`${OPENAI_API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.5,
    }),
  });

  const data = await response.json();

  return data.choices[0]?.message.content ?? null;
}
