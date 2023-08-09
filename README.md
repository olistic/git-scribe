# git-scribe

<div align="center">
  <img alt="Git Scribe illustration" title="Git Scribe" src="hero.webp?raw=true" />
</div>

<br />

<div align="center">
  <a href="https://www.npmjs.com/package/git-scribe">
    <img alt="npm" src="https://img.shields.io/npm/v/git-scribe?style=flat-square&color=%23a371f7">
  </a>
</div>

<br />

Git Scribe is your AI copilot for crafting insightful Git commit messages, streamlining your development process by translating code diffs into concise narratives.

## How it works

Git Scribe adds a [`prepare-commit-msg`](https://git-scm.com/docs/githooks#_prepare_commit_msg) hook to your Git repository upon [installation](#installation).

Whenever you need inspiration, simply execute `git commit` without passing a message and Git Scribe will give you a suggestion.

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
