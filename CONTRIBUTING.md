# Contributing


## Repository rules

1. Do not add non-generic features. This library must contain only clean, reusable code.
2. Add tests for your changes and keep code coverage at 100%.
3. Always update the [docs](DOCUMENTATION.md) and the [change log](CHANGELOG.md).


## Branching

Before working on a feature or bugfix, make sure to create a branch from the `dev` branch.

```
git checkout dev
git checkout -b my_branch
```

Open pull requests targeting `dev` when the coding is done. It will be reviewed before being accepted and merged.


## Code standards

We use [ESlint](https://github.com/eslint/eslint) to ensure that the code has a uniform appearance. The rules are defined [here](.eslintrc.js).


## Change log

We use [Semver](http://semver.org) for version management. Before opening the pull request, make sure to add an entry to `CHANGELOG.md` under the `Unreleased` tag, marked with the type of version increment required by your change.

**Examples**

```
## Unreleased
- [YYYY-mm-dd] *patch* [issue ID](JIRA issue or other reference URL) **A backwards-compatible bug fix**
- [YYYY-mm-dd] *minor* [issue ID](JIRA issue or other reference URL) **A backwards-compatible feature addition**
- [YYYY-mm-dd] *major* [issue ID](JIRA issue or other reference URL) **A breaking change**
```


Happy coding!
