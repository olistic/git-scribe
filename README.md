# git-scribe

Git Scribe is your AI copilot for crafting insightful Git commit messages, streamlining your development process by translating code diffs into concise narratives.

## Installation

1. Install [husky](https://typicode.github.io/husky) and `git-scribe`:

```sh
$ npm install --save-dev husky git-scribe
```

2. Enable Git hooks:

```sh
$ npx husky install
```

3. Add a `prepare-commit-msg` hook:

```sh
$ npx husky add .husky/prepare-commit-msg 'git-scribe "$1" "$2"'
```
