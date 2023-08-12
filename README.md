# Git Scribe

<div align="center">
  <img alt="Git Scribe illustration" title="Git Scribe" src="https://github.com/olistic/git-scribe/blob/ac313fb95fac78f1371159e37a7691d89ae40505/hero.webp?raw=true" />
</div>

<br />

<div align="center">
  <strong>Your AI copilot for crafting insightful Git commit messages</strong>
</div>

<br />

<div align="center">
  <a href="https://github.com/olistic/git-scribe/actions/workflows/ci.yaml">
    <img alt="GitHub CI Workflow" src="https://img.shields.io/github/actions/workflow/status/olistic/git-scribe/ci.yaml?style=flat-square&color=%23a371f7">
  </a>
  <a href="https://app.codecov.io/gh/olistic/git-scribe">
    <img alt="Codecov" src="https://img.shields.io/codecov/c/github/olistic/git-scribe?style=flat-square&color=%23a371f7">
  </a>
  <a href="https://www.npmjs.com/package/git-scribe">
    <img alt="npm" src="https://img.shields.io/npm/v/git-scribe?style=flat-square&color=%23a371f7">
  </a>
</div>

<br />

Git Scribe streamlines your development process by translating code diffs into concise narratives ✍️

Whenever you need inspiration, execute `git commit` and Git Scribe will suggest a message for you ✨

## Getting Started

Follow these steps to add Git Scribe to your repository:

1. Install `git-scribe` and [`husky`](https://typicode.github.io/husky):

```sh
$ npm install --save-dev git-scribe husky
```

2. Enable Git hooks:

```sh
$ npx husky install
```

3. Add the [`prepare-commit-msg`](https://git-scm.com/docs/githooks#_prepare_commit_msg) hook:

```sh
$ npx husky add .husky/prepare-commit-msg 'git-scribe "$1" "$2"'
```

Profit!

## Data Privacy

Git Scribe uses OpenAI API behind the scenes. If you have any concerns, you can review OpenAI's API data privacy policies [here](https://openai.com/api-data-privacy).
