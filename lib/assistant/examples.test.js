import { jest } from '@jest/globals';

jest.unstable_mockModule('../utils/git.js', () => ({
  getCommitMessage: jest.fn(),
  getGitDiff: jest.fn(),
}));
const { getCommitMessage, getGitDiff } = await import('../utils/git.js');

const { getExamples } = await import('./examples.js');

describe('getExamples', () => {
  it('returns the commit messages and diffs', async () => {
    getCommitMessage
      .mockResolvedValueOnce('first commit')
      .mockResolvedValueOnce('second commit')
      .mockResolvedValueOnce('third commit');
    getGitDiff
      .mockResolvedValueOnce('first diff')
      .mockResolvedValueOnce('second diff')
      .mockResolvedValueOnce('third diff');

    const examples = await getExamples();

    expect(getCommitMessage).toHaveBeenNthCalledWith(1, 'HEAD~0');
    expect(getCommitMessage).toHaveBeenNthCalledWith(2, 'HEAD~1');
    expect(getCommitMessage).toHaveBeenNthCalledWith(3, 'HEAD~2');
    expect(getGitDiff).toHaveBeenNthCalledWith(1, 'HEAD~0');
    expect(getGitDiff).toHaveBeenNthCalledWith(2, 'HEAD~1');
    expect(getGitDiff).toHaveBeenNthCalledWith(3, 'HEAD~2');
    expect(examples).toEqual([
      { message: 'first commit', diff: 'first diff' },
      { message: 'second commit', diff: 'second diff' },
      { message: 'third commit', diff: 'third diff' },
    ]);
  });
});
