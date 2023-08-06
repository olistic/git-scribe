import { execa } from 'execa';

const contextLines = 5;

export async function getGitDiffStaged() {
  try {
    const { stdout } = await execa('git', [
      'diff',
      '--staged',
      `--unified=${contextLines}`,
    ]);
    return stdout;
  } catch (err) {
    throw new Error(`Error fetching git diff: ${err.message}`);
  }
}
