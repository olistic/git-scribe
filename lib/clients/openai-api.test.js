import { jest } from '@jest/globals';

jest.unstable_mockModule('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));
const { default: fetch } = await import('node-fetch');
jest.unstable_mockModule('../utils/openai-api-key', () => ({
  getOpenAIAPIKey: jest.fn(),
}));
const { getOpenAIAPIKey } = await import('../utils/openai-api-key');

const { validateAPIKey, createChatCompletion } = await import(
  './openai-api.js'
);

describe('validateAPIKey', () => {
  it('returns true if the API key is valid', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: jest.fn() });

    const isValid = await validateAPIKey('foo');

    expect(getOpenAIAPIKey).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer foo',
      },
    });
    expect(isValid).toBe(true);
  });

  it('returns false if the API key is invalid', async () => {
    fetch.mockResolvedValueOnce({ ok: false, json: jest.fn() });

    const isValid = await validateAPIKey('foo');

    expect(getOpenAIAPIKey).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer foo',
      },
    });
    expect(isValid).toBe(false);
  });
});

describe('createChatCompletion', () => {
  it('returns the completion from the API', async () => {
    getOpenAIAPIKey.mockResolvedValueOnce('foo');
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({
        choices: [{ message: { content: 'some completion' } }],
      }),
    });

    const completion = await createChatCompletion(['some message']);

    expect(getOpenAIAPIKey).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer foo',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: ['some message'],
          temperature: 0.5,
        }),
      },
    );
    expect(completion).toBe('some completion');
  });
});
