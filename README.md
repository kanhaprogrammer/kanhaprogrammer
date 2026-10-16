# Generates the contribution snake shown at the bottom of the profile README.
# It writes two SVGs (light + dark) to a branch called "output" in THIS repo.
name: Generate snake animation

on:
  schedule:
    - cron: "0 */12 * * *"   # every 12 hours
  workflow_dispatch:          # lets you run it manually from the Actions tab
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: Platane/snk/svg-only@v3
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: |
            dist/github-snake.svg
            dist/github-snake-dark.svg?palette=github-dark

      - uses: crazy-max/ghaction-github-pages@v3.1.0
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
