![logo](logo.png)

# CommitGen

Generate meaningful Git commit messages with GPT, directly from your staged changes in VS Code.

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/woongheelee.vscode-commitgen?label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=woongheelee.vscode-commitgen)

## Features

- Generates concise and conventional commit messages from `git diff`
- Supports multiple languages: English, Korean, Japanese, Chinese
- Follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format
- Supports multiple OpenAI models: `gpt-4o`, `gpt-4-turbo`, `gpt-3.5-turbo`, etc.
- Secure API key storage via VS Code settings
- Easy to use with minimal configuration

## Installation

### Install from VS Code Marketplace (Recommended)

You can install CommitGen directly from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=woongheelee.vscode-commitgen).

1. Open VS Code
2. Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for `CommitGen`
4. Click **Install**

### Download from this repository

1. Download the `.vsix` file from [Releases](https://github.com/WoongheeLee/vscode-commitgen/releases)
2. In VS Code, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
   ```
   Extensions: Install from VSIX...
   ```
3. Select the downloaded `.vsix` file

### Build from Source (Manual Installation)

If you prefer to build the extension yourself from the source code:

1. Clone this repository:

   ```bash
   git clone https://github.com/WoongheeLee/vscode-commitgen.git
   cd vscode-commitgen
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Package the extension:

   If you have `vsce` installed globally:

   ```bash
   vsce package
   ```

   Or use `npx` without installing globally:

   ```bash
   npx vsce package
   ```

   This will generate a `.vsix` file (e.g., `vscode-commitgen-0.1.4.vsix`).

4. Install the extension in VS Code:

   - Open VS Code
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
   - Select "Extensions: Install from VSIX..."
   - Choose the generated `.vsix` file

You can also use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) to manage Node.js and npm locally without requiring global or sudo installs.

### Build from Source (Manual Installation)

If you prefer to build the extension yourself from the source code:

1. Clone this repository:

   ```bash
   git clone https://github.com/WoongheeLee/vscode-commitgen.git
   cd vscode-commitgen
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Package the extension:

   If you have `vsce` installed globally:

   ```bash
   vsce package
   ```

   Or use `npx` without installing globally:

   ```bash
   npx vsce package
   ```

   This will generate a `.vsix` file (e.g., `vscode-commitgen-0.1.4.vsix`).

4. Install the extension in VS Code:

   - Open VS Code
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
   - Select "Extensions: Install from VSIX..."
   - Choose the generated `.vsix` file

You can also use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) to manage Node.js and npm locally without requiring global or sudo installs.

## Getting Started

1. Open a Git-enabled project
2. Stage your changes (`git add .`)
3. Run the command:
   ```
   CommitGen: Generate Commit Message
   ```
4. A commit message will be generated using the selected model and language

If this is your first time using CommitGen, you will be prompted to enter your OpenAI API key:

```
File → Preferences → Settings → Extensions → CommitGen
```

## Configuration

You can customize the following options:

| Setting              | Default        | Description                                       |
|----------------------|----------------|---------------------------------------------------|
| `commitgen.apiKey`   | `""`           | Your OpenAI API key                               |
| `commitgen.model`    | `gpt-4o-mini`  | LLM model to use (`gpt-4o`, `gpt-3.5-turbo`, etc.)|
| `commitgen.language` | `english`      | Language of the commit message                    |

## Example Output

```diff
- Refactored the user login flow to handle edge cases
+ Added unit tests for login and token validation
```

Generated commit message:

```
test(auth): add unit tests for login and token validation
```

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Gladly welcoming contributors!  
Feel free to fork, improve, and send a pull request.

## TODO

- [ ] Automatically close the terminal after committing a message
- [ ] Support inclusion/exclusion filters for diff targets (e.g., specific file extensions or directories), to reduce unnecessary API calls
