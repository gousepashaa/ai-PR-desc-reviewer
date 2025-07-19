# Smart PR Description Generator

An AI-powered GitHub Action that automatically generates comprehensive pull request descriptions by analyzing code changes, commit messages, and related context.

## Problem Solved

Developers often create minimal or inconsistent pull request descriptions that don't provide adequate context for reviewers, slowing down the review process and reducing code quality. This leads to:

- Longer review cycles
- More back-and-forth questions
- Potential misunderstandings about implementation details
- Inconsistent documentation of changes

## Features

- Automatically generates detailed PR descriptions when PRs are created or updated
- Analyzes code changes to understand what was modified
- Extracts context from commit messages and branch names
- Identifies related tickets/issues
- Customizes description format based on PR type (feature, bugfix, etc.)
- Preserves any existing manual description content
- Notifies the PR author when a description is generated

## Setup Instructions

1. Add this GitHub Action to your repository
2. Configure your OpenAI API key as a repository secret named `OPENAI_API_KEY`
3. That's it! The action will run automatically on new PRs

## Ticket System Integration (Jira/Redmine)

You can enable integration with Jira or Redmine to automatically fetch ticket details (summary, description) for any ticket references found in branch names or commit messages. These details will be included in the generated PR description for richer context.

### Enabling Jira Integration

Add the following to your configuration (e.g., `.github/smart-pr-config.json` or `config/default.json`):

```json
"jira": {
  "enabled": true,
  "baseUrl": "https://your-jira-instance.atlassian.net",
  "username": "your-jira-username",
  "apiToken": "your-jira-api-token"
}
```

### Enabling Redmine Integration

```json
"redmine": {
  "enabled": true,
  "baseUrl": "https://your-redmine-instance.com",
  "apiKey": "your-redmine-api-key"
}
```

> **Note:** Only one system (Jira or Redmine) should be enabled at a time.



## Expanded Configuration Example

```json
{
  "templates": {
    "feature": "Your custom template for features",
    "bugfix": "Your custom template for bugfixes"
  },
  "skipLabels": ["documentation", "no-description"],
  "addComment": true,
  "jira": {
    "enabled": false,
    "baseUrl": "https://your-jira-instance.atlassian.net",
    "username": "your-jira-username",
    "apiToken": "your-jira-api-token"
  },
  "redmine": {
    "enabled": false,
    "baseUrl": "https://your-redmine-instance.com",
    "apiKey": "your-redmine-api-key"
  }
}
```
