# git-scribe

<div align="center">
  <img alt="Git Scribe illustration" title="Git Scribe" src="hero.webp?raw=true" />
</div>

<br />

<div align="center">
  <a href="https://www.npmjs.com/package/git-scribe">
    <img alt="npm" src="https://img.shields.io/npm/v/git-scribe?style=flat-square&color=%23a78bfa">
  </a>
</div>

<br />

Git Scribe is your AI copilot for crafting insightful Git commit messages, streamlining your development process by translating code diffs into concise narratives.

> [!IMPORTANT]
> Git Scribe uses OpenAI API behind the scenes. If you have any concerns, you can review OpenAI's API data privacy policies [here](https://openai.com/api-data-privacy).

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

## Usage

Simply execute `git commit` without passing a message and Git Scribe will do the rest. You will have the chance to review the generated message before committing.
