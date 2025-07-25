# Smart PR Description Reviewer

An AI-powered GitHub Action that automatically reviews and validates pull request descriptions to ensure they provide adequate context and accurately explain code changes.

## Problem Solved

Developers often create minimal or inconsistent pull request descriptions that don't provide adequate context for reviewers, slowing down the review process and reducing code quality. This leads to:

- Longer review cycles
- More back-and-forth questions
- Potential misunderstandings about implementation details
- Inconsistent documentation of changes

## Features

- Automatically reviews PR descriptions when PRs are created or updated
- Uses AI to analyze if descriptions accurately explain code changes
- Scores descriptions from 0-100% based on completeness, accuracy, and clarity
- Provides detailed feedback on what's missing or unclear
- Posts review comments directly on the PR
- Configurable minimum score thresholds
- Helps enforce PR description standards across your team

## Setup Instructions

### Basic Setup
1. Add this GitHub Action to your repository by creating `.github/workflows/pr-reviewer.yml`:

```yaml
name: PR Description Reviewer
on:
  pull_request:
    types: [opened, edited, synchronize]

jobs:
  review-pr-description:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: your-org/smart-pr-description-reviewer@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
```

2. Add your OpenAI API key as a repository secret named `OPENAI_API_KEY`
3. That's it! The action will review PR descriptions automatically

### Configuration

Create a `config/default.json` file to customize the reviewer behavior:

```json
{
  "minReviewScore": 80,
  "skipLabels": ["documentation", "no-review"],
  "enableDetailedFeedback": true
}
```

#### Configuration Options

- `minReviewScore` (default: 80): Minimum score required to pass review
- `skipLabels`: Array of PR labels that will skip the review process
- `enableDetailedFeedback`: Whether to provide detailed improvement suggestions

## How It Works

1. **Trigger**: Runs when PRs are opened, edited, or updated
2. **Analysis**: AI analyzes the PR description against code changes context
3. **Scoring**: Provides a 0-100% score based on:
   - Completeness of explanation
   - Accuracy of description
   - Clarity of communication
4. **Feedback**: Posts a comment with score and specific improvement suggestions
5. **Pass/Fail**: Comments indicate whether the description meets your team's standards
