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
