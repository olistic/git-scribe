import { execa } from 'execa';

export async function getGitDiff() {
  try {
    const { stdout } = await execa('git', ['diff', '--staged']);
    return stdout;
  } catch (err) {
    throw new Error(`Error fetching git diff: ${err.message}`);
  }
}
