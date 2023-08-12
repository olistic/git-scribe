import { jest } from '@jest/globals';

jest.unstable_mockModule('git-credential-node', () => ({
  approve: jest.fn(),
  fill: jest.fn(),
  reject: jest.fn(),
}));
const { approve, fill, reject } = await import('git-credential-node');
jest.unstable_mockModule('inquirer', () => ({
  __esModule: true,
  default: {
    prompt: jest.fn(),
  },
}));
const { default: inquirer } = await import('inquirer');
jest.unstable_mockModule('../clients/openai-api.js', () => ({
  validateAPIKey: jest.fn(),
}));
const { validateAPIKey } = await import('../clients/openai-api.js');

const { getOpenAIAPIKey } = await import('./openai-api-key.js');

describe('getOpenAIAPIKey', () => {
  it('returns the API key from the credential helper', async () => {
    fill.mockResolvedValueOnce({ password: 'foo' });
    validateAPIKey.mockResolvedValueOnce(true);

    const apiKey = await getOpenAIAPIKey();

    expect(fill).toHaveBeenCalledWith('https://api.openai.com');
    expect(validateAPIKey).toHaveBeenCalledWith('foo');
    expect(apiKey).toBe('foo');
    expect(inquirer.prompt).not.toHaveBeenCalled();
    expect(approve).not.toHaveBeenCalled();
  });

  it('rejects an invalid API key from the credential helper', async () => {
    fill
      .mockResolvedValueOnce({ password: 'invalid' })
      .mockResolvedValueOnce({ password: 'foo' });
    validateAPIKey.mockResolvedValueOnce(false).mockResolvedValueOnce(true);

    const apiKey = await getOpenAIAPIKey();

    expect(fill).toHaveBeenCalledWith('https://api.openai.com');
    expect(validateAPIKey).toHaveBeenNthCalledWith(1, 'invalid');
    expect(reject).toHaveBeenCalledWith('https://api.openai.com');
    expect(validateAPIKey).toHaveBeenNthCalledWith(2, 'foo');
    expect(apiKey).toBe('foo');
  });

  it('prompts the user for an API key if the credential helper does not have one', async () => {
    fill.mockResolvedValueOnce(null);
    inquirer.prompt.mockResolvedValueOnce({ apiKey: 'foo' });

    const apiKey = await getOpenAIAPIKey();

    expect(fill).toHaveBeenCalledWith('https://api.openai.com');
    expect(inquirer.prompt).toHaveBeenCalled();
    expect(approve).toHaveBeenCalledWith({
      url: 'https://api.openai.com',
      username: 'waldo',
      password: 'foo',
    });
    expect(apiKey).toBe('foo');
  });

  it('returns null if the user dismisses the prompt', async () => {
    fill.mockResolvedValueOnce(null);
    inquirer.prompt.mockResolvedValueOnce({ apiKey: undefined });

    const apiKey = await getOpenAIAPIKey();

    expect(fill).toHaveBeenCalledWith('https://api.openai.com');
    expect(inquirer.prompt).toHaveBeenCalled();
    expect(approve).not.toHaveBeenCalled();
    expect(apiKey).toBeNull();
  });
});
