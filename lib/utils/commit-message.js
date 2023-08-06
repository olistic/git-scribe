export function sanitizeCommitMessage(message) {
  return (
    message
      // Remove period at the end.
      .replace(/\.$/, '')
  );
}
