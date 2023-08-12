import { jest } from '@jest/globals';

const mockSpinner = {
  start: jest.fn(() => mockSpinner),
  stop: jest.fn(() => mockSpinner),
};
jest.unstable_mockModule('ora', () => ({
  __esModule: true,
  default: jest.fn(() => mockSpinner),
}));
const { default: ora } = await import('ora');

const { withSpinner } = await import('./spinner.js');

describe('withSpinner', () => {
  it('should start and stop the spinner', async () => {
    const mockPromise = Promise.resolve('some resolved value');

    const result = await withSpinner(mockPromise, 'some message');

    expect(ora).toHaveBeenCalledWith('some message');
    expect(mockSpinner.start).toHaveBeenCalled();
    expect(mockSpinner.stop).toHaveBeenCalled();
    expect(result).toBe('some resolved value');
  });

  it('should stop the spinner even if promise rejects', async () => {
    const mockError = new Error('mocked error');
    const mockPromise = Promise.reject(mockError);

    await expect(withSpinner(mockPromise, 'some message')).rejects.toThrow(
      'mocked error',
    );
    expect(mockSpinner.stop).toHaveBeenCalled();
  });
});
