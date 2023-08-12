import { jest } from '@jest/globals';

jest.unstable_mockModule('../clients/openai-api.js', () => ({
  createChatCompletion: jest.fn(),
}));
const { createChatCompletion } = await import('../clients/openai-api.js');
jest.unstable_mockModule('../utils/commit-message.js', () => ({
  sanitizeCommitMessage: jest.fn(),
  validateCommitMessage: jest.fn(),
}));
const { sanitizeCommitMessage, validateCommitMessage } = await import(
  '../utils/commit-message.js'
);
jest.unstable_mockModule('../utils/git.js', () => ({
  getGitDiffStaged: jest.fn(),
}));
const { getGitDiffStaged } = await import('../utils/git.js');
jest.unstable_mockModule('./examples.js', () => ({
  getExamples: jest.fn(),
}));
const { getExamples } = await import('./examples.js');

const { generateCommitMessage } = await import('./index.js');

describe('generateCommitMessage', () => {
  it('returns the commit message', async () => {
    getExamples.mockResolvedValueOnce([
      { message: 'first commit', diff: 'first diff' },
      { message: 'second commit', diff: 'second diff' },
    ]);
    getGitDiffStaged.mockResolvedValueOnce('staged diff');
    createChatCompletion.mockResolvedValueOnce('some unsanitized message');
    sanitizeCommitMessage.mockReturnValueOnce('some message');
    validateCommitMessage.mockReturnValueOnce(true);

    const message = await generateCommitMessage();

    expect(createChatCompletion).toHaveBeenCalledWith([
      {
        role: 'system',
        content:
          'You are an assistant that helps developers write commit messages. You will be provided with a git diff of the changes that are about to be committed. Write a commit message that describes the changes. Be extremely concise. Use imperative mood.',
      },
      { role: 'user', content: 'first diff' },
      { role: 'assistant', content: 'first commit' },
      { role: 'user', content: 'second diff' },
      { role: 'assistant', content: 'second commit' },
      { role: 'user', content: 'staged diff' },
    ]);
    expect(sanitizeCommitMessage).toHaveBeenCalledWith(
      'some unsanitized message',
    );
    expect(validateCommitMessage).toHaveBeenCalledWith('some message');
    expect(message).toBe('some message');
  });

  it('returns null if the commit message is invalid after three attempts', async () => {
    getExamples.mockResolvedValueOnce([
      { message: 'first commit', diff: 'first diff' },
      { message: 'second commit', diff: 'second diff' },
    ]);
    getGitDiffStaged.mockResolvedValueOnce('staged diff');
    createChatCompletion.mockResolvedValue('some unsanitized message');
    sanitizeCommitMessage.mockReturnValue('some invalid message');
    validateCommitMessage.mockReturnValue(false);

    const message = await generateCommitMessage();

    expect(createChatCompletion).toHaveBeenCalledTimes(3);
    expect(sanitizeCommitMessage).toHaveBeenCalledTimes(3);
    expect(validateCommitMessage).toHaveBeenCalledTimes(3);
    expect(message).toBe(null);
  });
});
