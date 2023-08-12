import { generateCommitMessage } from './assistant/index.js';
import { writeCommitMessage } from './utils/commit-message.js';
import { withSpinner } from './utils/spinner.js';

export async function prepareCommitMessage(filePath, source) {
  if (source !== '') {
    // A message has been provided, nothing to do.
    return;
  }

  const message = await withSpinner(
    generateCommitMessage(),
    'Generating commit message',
  );
  if (message === null) {
    // The assistant failed to generate a message, nothing to do.
    return;
  }

  await writeCommitMessage(filePath, message);
}
