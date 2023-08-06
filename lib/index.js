import { writeFile } from 'node:fs/promises';

import { createChatCompletion } from './clients/openai-api.js';
import {
  sanitizeCommitMessage,
  validateCommitMessage,
} from './utils/commit-message.js';
import { getGitDiffStaged } from './utils/git-diff.js';

const maxAttempts = 3;
const systemMessage =
  'You will be provided with a git diff of the changes that are about to be committed. Write a commit message that describes the changes. Be extremely concise. Use imperative mood.';

async function generateCommitMessage() {
  const diff = await getGitDiffStaged();

  let message = null;
  let isValid = false;
  let attempts = 0;
  do {
    const completion = await createChatCompletion([
      { role: 'system', content: systemMessage },
      { role: 'user', content: diff },
    ]);
    message = sanitizeCommitMessage(completion);
    isValid = validateCommitMessage(message);
    attempts += 1;
  } while (!isValid && attempts < maxAttempts);

  return message;
}

export async function prepareCommitMessage(filePath, source) {
  if (source !== '') {
    // A message has been provided, nothing to do.
    return;
  }

  const message = await generateCommitMessage();
  if (message === null) {
    // Unable to generate a valid message.
    return;
  }

  await writeFile(filePath, message);
}
