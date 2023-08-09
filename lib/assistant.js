import { createChatCompletion } from './clients/openai-api.js';
import {
  sanitizeCommitMessage,
  validateCommitMessage,
} from './utils/commit-message.js';
import { getGitDiffStaged } from './utils/git.js';

const maxAttempts = 3;
const systemMessage =
  'You are an assistant that helps developers write commit messages. You will be provided with a git diff of the changes that are about to be committed. Write a commit message that describes the changes. Be extremely concise. Use imperative mood.';

export async function generateCommitMessage() {
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
