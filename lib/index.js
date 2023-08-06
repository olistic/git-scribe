import { writeFile } from 'node:fs/promises';

export async function prepareCommitMessage(filePath, source) {
  if (source !== '') {
    // A message has been provided, nothing to do.
    return;
  }

  const message = '# This is a test';

  await writeFile(filePath, message);
}
