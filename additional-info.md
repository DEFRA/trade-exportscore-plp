# Additional Information that may be of help

## Recommended Extensions

| Name                 | VS Code Id                          | Description                                                                                                                         |
| -------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Jest                 | vscode-jest                         | Adds "Run/Debug" intellisense links in the actual test file.                                                                        |
| Jest Runner          | vscode-jest                         | Adds the "Run AlL" to the Test Explorer Extension (if installed)                                                                    |
| Azure Pipelines      | ms-azure-devops.azure-pipelines     | Adds additional support for formatting and syntax checking whilst editing ADO Pipelines... helpful even though we're using GitHub.  |
| Docker               | ms-azuretools.vscode-docker         | Mentioned elsewhere as the desktop tool - this is the VS-Code extension for easier consumption of Docker.                           |
| Dev Containters      | xms-vscode-remote.remote-containers | Microsoft supplied additional functionality for interacting with Docker containers.                                                 |
| GitHub Actions       | github.vscode-github-actions        | The GitHub Actions extension lets you manage your workflows and a host of other GitHub activities.                                  |
| GitHub Pull Requests | github.vscode-pull-request-github   | The GitHub Pull Requests extension lets you manage your PRs from within VS-Code.                                                    |
| markdownlint         | davidanson.vscode-markdownlint      | This extension helps ensure any Markdown files follow the industry recommendations.                                                 |
| WSL                  | ms-vscode-remote.remote-wsl         | This extension helps ensure any Markdown files follow the industry recommendations.                                                 |
| YAML                 | redhat.vscode-yaml                  | This extension helps when editing YAML / YML files - might make the ADO one above mute but I have both so am mentioning for safety. |

## GPG Commit Signing - Additional Information

[Setting Up in WSL](https://blog.jmorbegoso.com/post/configure-github-gpg-key-in-windows-and-wsl/) - may be of help if the 2 links in the ADO Wiki do not help.

WSL configuration should be returned from `git config --global --list` with similar results to the below:

```text
user.email=your.capgemini.email.address@capgemini.com
user.name=Your Name
user.signingkey=either your email address (or the Alpha-numeric name depending on how you configured)
gpg.program=/mnt/c/Users/{username}/AppData/Local/Programs/GnuPG/bin/gpg.exe (or /mnt/c/Program Files (x86)/gnupg/bin/gpg.exe)
commit.gpgsign=true
tag.gpgsign=true
```

GPG can have issues redirecting the output (i.e. the request for the password to sign the commit). To resolve:

```text
export GPG_TTY=$(tty)
```
