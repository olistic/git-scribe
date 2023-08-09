import { approve, fill, reject } from 'git-credential-node';
import inquirer from 'inquirer';
import fetch from 'node-fetch';

import {
  OPENAI_API_BASE_URL,
  OPENAI_API_KEY_HELP_URL,
} from '../constants/index.js';

async function validateAPIKey(apiKey) {
  const url = `${OPENAI_API_BASE_URL}/models`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    return false;
  }

  return true;
}

async function prompt() {
  const { apiKey } = await inquirer.prompt([
    {
      name: 'apiKey',
      message: 'Enter your OpenAI API key:',
      validate: async (input) => {
        if (input.length === 0) {
          return 'Required.';
        }

        if (!(await validateAPIKey(input))) {
          return `Invalid API key. See: ${OPENAI_API_KEY_HELP_URL}.`;
        }

        return true;
      },
    },
  ]);
  return apiKey;
}

export async function getOpenAIAPIKey() {
  const url = OPENAI_API_BASE_URL;

  const credential = await fill(url);
  const apiKey = credential ? credential.password : await prompt();
  if (apiKey === undefined) {
    // The user has dismissed the prompt.
    return null;
  }

  if (!(await validateAPIKey(apiKey))) {
    // An invalid API key was stored, reject it and prompt the user for a new one.
    await reject(url);
    return getOpenAIAPIKey();
  }

  await approve({
    url,
    username: 'waldo', // Not used.
    password: apiKey,
  });

  return apiKey;
}
