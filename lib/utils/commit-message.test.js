import { jest } from '@jest/globals';

jest.unstable_mockModule('node:fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));
const { readFile, writeFile } = await import('node:fs/promises');

const { sanitizeCommitMessage, validateCommitMessage, writeCommitMessage } =
  await import('./commit-message.js');

describe('sanitizeCommitMessage', () => {
  it('should remove a period from the end of the message', () => {
    const message = 'This is the way.';
    const sanitizedMessage = sanitizeCommitMessage(message);
    expect(sanitizedMessage).toBe('This is the way');
  });

  it('should return the same message if there is no period at the end', () => {
    const message = 'A long time ago in a galaxy far, far away';
    const sanitizedMessage = sanitizeCommitMessage(message);
    expect(sanitizedMessage).toBe(message);
  });
});

describe('validateCommitMessage', () => {
  it('should return true for messages shorter than 55 characters', () => {
    const message = 'Short message';
    expect(validateCommitMessage(message)).toBe(true);
  });

  it('should return false for messages that are 55 characters or longer', () => {
    const message = 'A'.repeat(55);
    expect(validateCommitMessage(message)).toBe(false);
  });
});

describe('writeCommitMessage', () => {
  it('should prepend the commit message to the file', async () => {
    const filePath = 'some file path';
    const message = 'some message';
    const template = 'some template';
    const messageWithTemplate = `${message}\n${template}`;
    readFile.mockResolvedValueOnce(template);

    await writeCommitMessage(filePath, message);

    expect(readFile).toHaveBeenCalledWith(filePath, 'utf8');
    expect(writeFile).toHaveBeenCalledWith(filePath, messageWithTemplate);
  });
});
