import { approve, fill, reject } from 'git-credential-node';
import inquirer from 'inquirer';

import { validateAPIKey } from '../clients/openai-api.js';
import { OPENAI_API_BASE_URL } from '../constants/index.js';

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
          return 'Invalid API key.';
        }

        return true;
      },
    },
  ]);
  return apiKey;
}

export async function getOpenAIAPIKey() {
  const credential = await fill(OPENAI_API_BASE_URL);
  if (credential) {
    const apiKey = credential.password;

    const isValid = await validateAPIKey(apiKey);
    if (!isValid) {
      // An invalid API key was stored, reject it and ask for a new one.
      await reject(OPENAI_API_BASE_URL);
      return getOpenAIAPIKey();
    }

    return apiKey;
  }

  const apiKey = await prompt();
  if (!apiKey) {
    // The user has dismissed the prompt.
    return null;
  }

  // Store the API key.
  await approve({
    url: OPENAI_API_BASE_URL,
    username: 'waldo', // Not used.
    password: apiKey,
  });

  return apiKey;
}
