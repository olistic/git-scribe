import { createChatCompletion } from './clients/openai-api.js';
import {
  sanitizeCommitMessage,
  validateCommitMessage,
  writeCommitMessage,
} from './utils/commit-message.js';
import { getGitDiffStaged } from './utils/git-diff.js';
import { withSpinner } from './utils/spinner.js';

const maxAttempts = 3;
const systemMessage =
  'You are an assistant that helps developers write commit messages. You will be provided with a git diff of the changes that are about to be committed. Write a commit message that describes the changes. Be extremely concise. Use imperative mood.';

async function generateCommitMessage() {
  const diff = await getGitDiffStaged();

  let attempts = 0;
  while (attempts < maxAttempts) {
    const unsanitizedMessage = await createChatCompletion([
      { role: 'system', content: systemMessage },
      { role: 'user', content: diff },
    ]);
    const message = sanitizeCommitMessage(unsanitizedMessage);
    if (validateCommitMessage(message)) {
      return message;
    }

    attempts += 1;
  }

  return null;
}

export async function prepareCommitMessage(filePath, source) {
  if (source !== '') {
    // A message has been provided, nothing to do.
    return;
  }

  const message = await withSpinner(
    generateCommitMessage,
    'Generating commit message',
  );
  if (message === null) {
    // The assistant failed to generate a message, nothing to do.
    return;
  }

  await writeCommitMessage(filePath, message);
}
