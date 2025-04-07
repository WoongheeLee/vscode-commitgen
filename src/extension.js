

// src/extension.js
const vscode = require('vscode');
const { getGitDiff } = require('./commitgen/gitdiff');
const { generateCommitMessage } = require('./commitgen/generator');
const { loadApiKey } = require('./commitgen/config');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('CommitGen is now active!');

  // Register the setApiKey command
  let setApiKeyCommand = vscode.commands.registerCommand('vscode-commitgen.setApiKey', async function () {
    try {
      const apiKey = await vscode.window.showInputBox({
        prompt: 'Enter your OpenAI API Key',
        password: true,
        ignoreFocusOut: true,
        placeHolder: 'sk-...'
      });
      
      if (apiKey) {
        // Store the API key in configuration (securely)
        await vscode.workspace.getConfiguration('commitgen').update('apiKey', apiKey, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage('CommitGen: API key saved successfully');
      }
    } catch (error) {
      vscode.window.showErrorMessage(`CommitGen Error: ${error.message}`);
    }
  });
  
  context.subscriptions.push(setApiKeyCommand);

  // Register the generateCommitMessage command
  let disposable = vscode.commands.registerCommand('vscode-commitgen.generateCommitMessage', async function () {
    try {
      const config = vscode.workspace.getConfiguration('commitgen');
      const language = config.get('language', 'english');
      const model = config.get('model', 'gpt-4o-mini');
  
      // Check if API key is set
      try {
        await loadApiKey();
      } catch (error) {
        const setKey = 'Set API Key';
        const result = await vscode.window.showErrorMessage(
          'CommitGen: OpenAI API key not found. Please set your API key first.',
          setKey
        );
        if (result === setKey) {
          await vscode.commands.executeCommand('vscode-commitgen.setApiKey');
        }
        return;
      }
  
      if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('CommitGen: No workspace folder found. Please open a project folder.');
        return;
      }
  
      const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
  
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "CommitGen",
        cancellable: false
      }, async (progress) => {
        progress.report({ message: "Getting git diff..." });
  
        const gitDiff = await getGitDiff(rootPath);
        if (!gitDiff.trim()) {
          vscode.window.showWarningMessage('CommitGen: No staged changes found. Please run `git add` first.');
          return;
        }
  
        progress.report({ message: `Generating commit message in ${language} using ${model}...` });
  
        let message = await generateCommitMessage(gitDiff, model, language);
  
        if (!message) {
          vscode.window.showErrorMessage('CommitGen: Failed to generate commit message. Please try again.');
          return;
        }
  
        const result = await vscode.window.showInformationMessage(
          `Generated commit message:\n\n${message}`,
          { modal: true },
          'Commit',
          'Copy to Clipboard',
        );
  
        if (result === 'Commit') {
          const terminal = vscode.window.createTerminal('CommitGen');
          terminal.sendText(`git commit -m "${message.replace(/"/g, '\\"')}"`);
          terminal.show();
          vscode.window.showInformationMessage('CommitGen: Commit executed.');
        } else if (result === 'Copy to Clipboard') {
          await vscode.env.clipboard.writeText(message);
          vscode.window.showInformationMessage('CommitGen: Commit message copied to clipboard.');
        }
      });
    } catch (error) {
      vscode.window.showErrorMessage(`CommitGen Error: ${error.message}`);
    }
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};





