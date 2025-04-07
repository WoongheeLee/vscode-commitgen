![logo](logo.png)

# CommitGen

Generate meaningful Git commit messages with GPT, directly from your staged changes in VS Code.

## Features

- Generates concise and conventional commit messages from `git diff`
- Supports multiple languages: English, Korean, Japanese, Chinese
- Follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format
- Supports multiple OpenAI models: `gpt-4o`, `gpt-4-turbo`, `gpt-3.5-turbo`, etc.
- Secure API key storage via VS Code settings
- Easy to use with minimal configuration

## Installation

1. Download the `.vsix` file from [Releases](https://github.com/WoongheeLee/vscode-commitgen/releases)
2. In VS Code, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
   ```
   Extensions: Install from VSIX...
   ```
3. Select the downloaded `.vsix` file

Alternatively, this extension will be available on the VS Code Marketplace in the future.

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
