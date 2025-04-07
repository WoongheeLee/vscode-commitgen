// src/commitgen/gitdiff.js
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Get the git diff for staged changes
 * @param {string} rootPath - Path to the git repository
 * @returns {Promise<string>} - The git diff text
 */
async function getGitDiff(rootPath) {
  try {
    const { stdout } = await execPromise('git diff --cached', { cwd: rootPath });
    return stdout;
  } catch (error) {
    throw new Error(`Failed to get git diff: ${error.message}`);
  }
}

module.exports = {
  getGitDiff
};
