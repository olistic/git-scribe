import {
  sanitizeCommitMessage,
  validateCommitMessage,
} from './commit-message.js';

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
