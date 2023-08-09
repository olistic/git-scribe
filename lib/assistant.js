import { createChatCompletion } from './clients/openai-api.js';
import {
  sanitizeCommitMessage,
  validateCommitMessage,
} from './utils/commit-message.js';
import { getCommitMessage, getGitDiff, getGitDiffStaged } from './utils/git.js';

const exampleCount = 3;
const maxAttempts = 3;
const systemMessage =
  'You are an assistant that helps developers write commit messages. You will be provided with a git diff of the changes that are about to be committed. Write a commit message that describes the changes. Be extremely concise. Use imperative mood.';

async function getExamples() {
  const commitsAndDiffs = [];

  for (let i = 0; i < exampleCount; i++) {
    const commitMessage = await getCommitMessage(`HEAD~${i}`);
    const commitDiff = await getGitDiff(`HEAD~${i}`);
    commitsAndDiffs.push({ message: commitMessage, diff: commitDiff });
  }

  return commitsAndDiffs;
}

export async function generateCommitMessage() {
  const examples = await getExamples();

  const prompt = await getGitDiffStaged();

  let attempts = 0;
  while (attempts < maxAttempts) {
    const conversation = [
      { role: 'system', content: systemMessage },
      ...examples.flatMap(({ diff, message }) => [
        { role: 'user', content: diff },
        { role: 'assistant', content: message },
      ]),
      { role: 'user', content: prompt },
    ];
    const unsanitizedMessage = await createChatCompletion(conversation);
    const message = sanitizeCommitMessage(unsanitizedMessage);
    if (validateCommitMessage(message)) {
      return message;
    }

    attempts += 1;
  }

  return null;
}
