import { jest } from '@jest/globals';

jest.unstable_mockModule('./assistant/index.js', () => ({
  generateCommitMessage: jest.fn(),
}));
const { generateCommitMessage } = await import('./assistant/index.js');
jest.unstable_mockModule('./utils/commit-message.js', () => ({
  writeCommitMessage: jest.fn(),
}));
const { writeCommitMessage } = await import('./utils/commit-message.js');
jest.unstable_mockModule('./utils/spinner.js', () => ({
  withSpinner: jest.fn(),
}));
const { withSpinner } = await import('./utils/spinner.js');

const { prepareCommitMessage } = await import('./index.js');

describe('prepareCommitMessage', () => {
  it('generates and writes the commit message', async () => {
    generateCommitMessage.mockResolvedValueOnce('some message');
    withSpinner.mockResolvedValueOnce('some message');

    await prepareCommitMessage('some file path', '');

    expect(generateCommitMessage).toHaveBeenCalled();
    expect(writeCommitMessage).toHaveBeenCalledWith(
      'some file path',
      'some message',
    );
  });

  it('does nothing if a commit message has been provided', async () => {
    await prepareCommitMessage('some file path', 'message');

    expect(generateCommitMessage).not.toHaveBeenCalled();
    expect(writeCommitMessage).not.toHaveBeenCalled();
  });

  it('does nothing if the assistant fails to generate a commit message', async () => {
    generateCommitMessage.mockResolvedValueOnce(null);
    withSpinner.mockResolvedValueOnce(null);

    await prepareCommitMessage('some file path', '');

    expect(generateCommitMessage).toHaveBeenCalled();
    expect(writeCommitMessage).not.toHaveBeenCalled();
  });
});
