import { writeFile } from 'node:fs/promises';

import { createChatCompletion } from './clients/openai-api.js';
import { sanitizeCommitMessage } from './utils/commit-message.js';
import { getGitDiff } from './utils/get-git-diff.js';

const systemMessage =
  'You will be provided with a git diff of the changes that are about to be committed. Write a commit message that describes the changes. Be extremely concise. Use imperative mood.';

export async function prepareCommitMessage(filePath, source) {
  if (source !== '') {
    // A message has been provided, nothing to do.
    return;
  }

  const diff = await getGitDiff();

  const message = await createChatCompletion([
    { role: 'system', content: systemMessage },
    { role: 'user', content: diff },
  ]);

  await writeFile(filePath, sanitizeCommitMessage(message));
}
