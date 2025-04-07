// src/commitgen/generator.js
const axios = require('axios');
const { loadApiKey, loadPromptTemplate } = require('./config');

// Constants
const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // 1 second

/**
 * Call the OpenAI API to generate a commit message
 * @param {string} systemPrompt - The system prompt for the OpenAI API
 * @param {string} userPrompt - The user prompt for the OpenAI API
 * @param {string} model - The model to use
 * @returns {Promise<string>} - The generated commit message
 */
async function getOpenAIApiResult(systemPrompt, userPrompt, model) {
  const apiKey = await loadApiKey();
  
  const payload = {
    model: model,
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: userPrompt
      }
    ],
    max_tokens: 4096,
    temperature: 0,
    top_p: 0.7
  };
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        payload,
        { headers }
      );
      
      return response.data.choices[0].message.content;
    } catch (error) {
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        throw new Error(`OpenAI API error: ${error.message}`);
      }
    }
  }
  
  return '';
}

/**
 * Generate a commit message based on git diff
 * @param {string} gitDiffText - The git diff text
 * @param {string} model - The model to use
 * @param {string} language - The language for the commit message
 * @returns {Promise<string>} - The generated commit message
 */
async function generateCommitMessage(gitDiffText, model = 'gpt-4o-mini', language = 'english') {
  const { commitFormat, commitType } = await loadPromptTemplate();
  
  const systemPrompt = `
You are an assistant that generates concise and meaningful Git commit messages from git diffs.
Write the commit message in ${language}.
Follow the Conventional Commit format: ${commitFormat}

Available types:
${commitType}
Return only the commit message, no explanation or extra output.
`;

  const userPrompt = `
Generate a commit message based on the following staged git diff:

${gitDiffText}
`;

  return getOpenAIApiResult(systemPrompt, userPrompt, model);
}

module.exports = {
  generateCommitMessage
};