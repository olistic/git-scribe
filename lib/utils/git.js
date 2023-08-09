import { execa } from 'execa';

const contextLines = 5;
const excludedFiles = ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock'];

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
