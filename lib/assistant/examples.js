import { getCommitMessage, getGitDiff } from '../utils/git.js';

const exampleCount = 3;

export async function getExamples() {
  const commitsAndDiffs = [];

  for (let i = 0; i < exampleCount; i++) {
    const reference = `HEAD~${i}`;
    const commitMessage = await getCommitMessage(reference);
    const commitDiff = await getGitDiff(reference);
    commitsAndDiffs.push({ message: commitMessage, diff: commitDiff });
  }

  return commitsAndDiffs;
}
