import { readFile, writeFile } from 'node:fs/promises';

export function sanitizeCommitMessage(message) {
  return (
    message
      // Remove period at the end.
      .replace(/\.$/, '')
  );
}

export function validateCommitMessage(message) {
  return message.length < 55;
}

export async function writeCommitMessage(filePath, message) {
  const template = await readFile(filePath, 'utf8');
  const messageWithTemplate = `${message}\n${template}`;
  return writeFile(filePath, messageWithTemplate);
}
