import fetch from 'node-fetch';

import { OPENAI_API_BASE_URL } from '../constants/index.js';
import { getOpenAIAPIKey } from '../utils/openai-api-key.js';

const model = 'gpt-3.5-turbo';
const temperature = 0.5;

async function makeRequest(endpoint, method = 'GET', body = null) {
  const apiKey = await getOpenAIAPIKey();

  const response = await fetch(`${OPENAI_API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  const data = await response.json();

  return data;
}

export async function createChatCompletion(messages) {
  const data = await makeRequest('/chat/completions', 'POST', {
    model,
    messages,
    temperature,
  });
  return data.choices[0]?.message.content ?? null;
}
