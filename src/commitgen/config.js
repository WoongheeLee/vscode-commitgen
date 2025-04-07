// src/commitgen/config.js
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const os = require('os');
const vscode = require('vscode');

/**
 * Resolve a path with ~ for home directory
 * @param {string} filePath - Path to resolve
 * @returns {string} - Resolved path
 */
function resolvePath(filePath) {
  if (filePath.startsWith('~')) {
    return path.join(os.homedir(), filePath.slice(1));
  }
  return filePath;
}

/**
 * Load OpenAI API key from configuration
 * @returns {Promise<string>} - The OpenAI API key
 */
async function loadApiKey() {
  try {
    const config = vscode.workspace.getConfiguration('commitgen');
    const apiKey = config.get('apiKey', '');
    
    if (apiKey) {
      return apiKey;
    }
    
    // Fallback to file if no API key is set in configuration
    try {
      const filePath = '~/.api_keys/openai.json';
      const fullPath = resolvePath(filePath);
      const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      return data.api_key;
    } catch (fileError) {
      // If no API key in file, prompt user to enter one
      throw new Error('API key not found. Please set your OpenAI API key.');
    }
  } catch (error) {
    throw new Error(`Failed to load API key: ${error.message}`);
  }
}

/**
 * Load prompt template from extension resources
 * @returns {Promise<{commitFormat: string, commitType: string}>} - The prompt template
 */
async function loadPromptTemplate() {
  try {
    // Get the extension path
    const extension = vscode.extensions.getExtension('vscode-commitgen');
    if (!extension) {
      throw new Error('Extension not found');
    }
    
    const templatePath = path.join(extension.extensionPath, 'resources', 'prompt_template.yml');
    const template = yaml.load(fs.readFileSync(templatePath, 'utf8'));
    
    return {
      commitFormat: template.commit_format,
      commitType: template.commit_type
    };
  } catch (error) {
    // Fallback to default template if the file doesn't exist
    return {
      commitFormat: '<type>(<scope>): <subject>',
      commitType: `
feat: A new feature
fix: A bug fix
docs: Documentation changes
style: Code style changes (formatting, etc)
refactor: Code changes that neither fix bugs nor add features
perf: Performance improvements
test: Test-related changes
chore: Changes to the build process or tools
`
    };
  }
}

module.exports = {
  loadApiKey,
  loadPromptTemplate
};
