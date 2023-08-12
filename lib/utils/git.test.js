import { jest } from '@jest/globals';

jest.unstable_mockModule('execa', () => ({
  execa: jest.fn(),
}));
const { execa } = await import('execa');

const { getCommitMessage, getGitDiff, getGitDiffStaged } = await import(
  './git.js'
);

describe('getCommitMessage', () => {
  it('should fetch the commit message successfully', async () => {
    const mockCommitMessage = 'some mocked commit message';
    execa.mockResolvedValueOnce({ stdout: mockCommitMessage });

    const result = await getCommitMessage('abcd123');

    expect(execa).toHaveBeenCalledWith('git', [
      'log',
      '-1',
      '--pretty=format:%s',
      'abcd123',
    ]);
    expect(result).toBe(mockCommitMessage);
  });

  it('should throw an error if fetching git commit fails', async () => {
    const mockError = new Error('mocked error');
    execa.mockRejectedValueOnce(mockError);

    await expect(getCommitMessage('abcd123')).rejects.toThrow(
      'Error fetching git commit message: mocked error',
    );
  });
});

describe('getGitDiff', () => {
  it('should fetch the git diff successfully', async () => {
    const mockDiff = 'some mocked git diff output';
    execa.mockResolvedValueOnce({ stdout: mockDiff });

    const result = await getGitDiff('abcd123');

    expect(execa).toHaveBeenCalledWith('git', [
      'diff',
      'abcd123^..abcd123',
      `--unified=5`,
      '--',
      '.',
      ':!package-lock.json',
      ':!pnpm-lock.yaml',
      ':!yarn.lock',
    ]);
    expect(result).toBe(mockDiff);
  });

  it('should throw an error if fetching git diff fails', async () => {
    const mockError = new Error('mocked error');
    execa.mockRejectedValueOnce(mockError);

    await expect(getGitDiff('abcd123')).rejects.toThrow(
      'Error fetching git diff: mocked error',
    );
  });
});

describe('getGitDiffStaged', () => {
  it('should fetch the git diff successfully', async () => {
    const mockDiff = 'some mocked git diff output';
    execa.mockResolvedValueOnce({ stdout: mockDiff });

    const result = await getGitDiffStaged();

    expect(execa).toHaveBeenCalledWith('git', [
      'diff',
      '--staged',
      `--unified=5`,
      '--',
      '.',
      ':!package-lock.json',
      ':!pnpm-lock.yaml',
      ':!yarn.lock',
    ]);
    expect(result).toBe(mockDiff);
  });

  it('should throw an error if fetching git diff fails', async () => {
    const mockError = new Error('mocked error');
    execa.mockRejectedValueOnce(mockError);

    await expect(getGitDiffStaged()).rejects.toThrow(
      'Error fetching git diff: mocked error',
    );
  });
});
