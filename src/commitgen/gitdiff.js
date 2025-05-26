// src/commitgen/gitdiff.js
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Strip outputs and execution_count from .ipynb diff blocks only
 * @param {string[]} diffLines - Array of lines from full diff
 * @returns {string[]} - Cleaned diff lines
 */
function cleanDiffLinesByFile(diffLines) {
  const result = [];
  let currentFile = null;
  let buffer = [];

  const flush = () => {
    if (currentFile && currentFile.endsWith('.ipynb')) {
      // Only filter .ipynb files
      const cleaned = buffer.filter(line => {
        // Remove lines containing outputs or execution_count in JSON structure
        return !(
          line.match(/^\+.*"outputs":\s*\[/) ||
          line.match(/^\-.*"outputs":\s*\[/) ||
          line.match(/^\+.*"execution_count":\s*(null|\d+)/) ||
          line.match(/^\-.*"execution_count":\s*(null|\d+)/) ||
          // Also remove the closing brackets and content inside outputs array
          (line.match(/^\+.*\]$/) && buffer.some(prevLine => prevLine.match(/^\+.*"outputs":\s*\[/))) ||
          (line.match(/^\-.*\]$/) && buffer.some(prevLine => prevLine.match(/^\-.*"outputs":\s*\[/)))
        );
      });
      result.push(...cleaned);
    } else {
      // Keep other files unchanged
      result.push(...buffer);
    }
    buffer = [];
  };

  for (const line of diffLines) {
    if (line.startsWith('diff --git')) {
      flush();
      // Extract filename from diff header: diff --git a/path/file.ext b/path/file.ext
      const match = line.match(/^diff --git a\/(.+?) b\/(.+)$/);
      if (match) {
        currentFile = match[2]; // Use the 'b/' version (after change)
      } else {
        currentFile = null;
      }
    }
    buffer.push(line);
  }
  
  // Don't forget to flush the last file
  flush();

  return result;
}

/**
 * Get the git diff for staged changes, filtering only .ipynb outputs
 * @param {string} rootPath - Path to the git repository
 * @returns {Promise<string>} - The cleaned git diff text
 */
async function getGitDiff(rootPath) {
  try {
    const { stdout } = await execPromise('git diff --cached', { cwd: rootPath });
    
    if (!stdout.trim()) {
      return stdout; // Return empty if no staged changes
    }
    
    const lines = stdout.split('\n');
    const cleanedLines = cleanDiffLinesByFile(lines);
    return cleanedLines.join('\n');
  } catch (error) {
    throw new Error(`Failed to get git diff: ${error.message}`);
  }
}

module.exports = {
  getGitDiff
};