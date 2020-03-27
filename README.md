# Project Wallace Diff Github Action

This GitHub actions posts your CSS to [projectwallace.com](https://www.projectwallace.com?ref=gh-diff-action), calculates the change between the current state of your project and your PR, and comments the diff in the PR.

## Usage

### Inputs

| Name                    | Required   | Example                                                       | Description                                                                                                                                                                                                                                                                                                     |
| ----------------------- | ---------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `github-token`          | _required_ | `github-token: ${{ secrets.GITHUB_TOKEN }}`                   | This Action uses this token to post a comment with the diff.                                                                                                                                                                                                                                                    |
| `project-wallace-token` | _required_ | `project-wallace-token: ${{ secrets.PROJECT_WALLACE_TOKEN }}` | The webhook token for your project on projectwallace.com. You can find this token in the project settings. You must add this token to your [repository secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets#creating-encrypted-secrets) first! |
| `css-path`              | _required_ | `css-path: ./build/style.css`                                 | Path to the CSS file that should be analyzed and compared to the data on projectwallace.com.                                                                                                                                                                                                                    |

### Example

```yaml
name: CSS Workflow

on:
  pull_request: # only run this action on pull requests
    branches: [master] # and only to the master branch

jobs:
  cssDiff:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Project Wallace Diff
        uses: projectwallace/css-diff-action@master
        with:
          project-wallace-token: ${{ secrets.PROJECT_WALLACE_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          css-path: ./build/style.css
```
