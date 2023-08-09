import ora from 'ora';

export async function withSpinner(fn, message) {
  const spinner = ora(message).start();
  try {
    return await fn();
  } finally {
    spinner.stop();
  }
}
