import ora from 'ora';

export async function withSpinner(promise, message) {
  const spinner = ora(message).start();
  try {
    return await promise;
  } finally {
    spinner.stop();
  }
}
