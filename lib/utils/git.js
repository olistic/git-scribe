import { execa } from 'execa';

const contextLines = 5;
const excludedFiles = ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock'];

export async function getCommitMessage(reference) {
  try {
    const { stdout } = await execa('git', [
      'log',
      '-1', // Get the latest commit.
      `--pretty=format:%s`, // Format to just the subject (commit message title).
      reference,
    ]);
    return stdout;
  } catch (err) {
    throw new Error(`Error fetching commit message: ${err.message}`);
  }
}

export async function getGitDiffStaged() {
  try {
    const { stdout } = await execa('git', [
      'diff',
      '--staged',
      `--unified=${contextLines}`,
      '--',
      '.',
      ...excludedFiles.map((file) => `:!${file}`),
    ]);
    return stdout;
  } catch (err) {
    throw new Error(`Error fetching git diff: ${err.message}`);
  }
}

export async function getGitDiffForReference(reference) {
  try {
    const { stdout } = await execa('git', [
      'diff',
      `${reference}^..${reference}`,
      `--unified=${contextLines}`,
      '--',
      '.',
      ...excludedFiles.map((file) => `:!${file}`),
    ]);
    return stdout;
  } catch (err) {
    throw new Error(`Error fetching git diff: ${err.message}`);
  }
}
