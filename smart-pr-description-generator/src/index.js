const core = require('@actions/core');
const github = require('@actions/github');
const { reviewDescription } = require('./reviewer');
const config = require('../config/default.json');

async function run() {
  try {
    console.log('🚀 Starting Smart PR Description Reviewer...');
    // Get inputs
    const githubToken = core.getInput('github-token', { required: true });
    const openaiApiKey = core.getInput('openai-api-key', { required: true });
    // Get PR context
    const context = github.context;
    if (!context.payload.pull_request) {
      core.info('❌ This action can only be run on pull request events');
      return;
    }
    const prNumber = context.payload.pull_request.number;
    const repo = context.repo;
    console.log(`📋 Processing PR #${prNumber} in ${repo.owner}/${repo.repo}`);
    // Initialize octokit
    const octokit = github.getOctokit(githubToken);
    // Get PR details
    const { data: pullRequest } = await octokit.rest.pulls.get({
      ...repo,
      pull_number: prNumber,
    });
    // Review the PR description using AI
    const analysis = {
      prTitle: pullRequest.title,
      prBody: pullRequest.body || '',
      branchName: pullRequest.head.ref,
      tickets: [],
      components: [],
      changedFiles: [],
      commitMessages: [],
      diffStats: { additions: 0, deletions: 0, files: 0 },
    };
    // Optionally, you can add more analysis logic here or import a minimal analyzer if needed
    const review = await reviewDescription(analysis, pullRequest.body || '', openaiApiKey);
    const minScore = config.minReviewScore || 80;
    if (review.score !== null && review.score < minScore) {
      await octokit.rest.issues.createComment({
        ...repo,
        issue_number: prNumber,
        body: `🚩 **PR Description Review**\n\nScore: ${review.score}%\n\n${review.feedback}`
      });
    } else if (review.score !== null) {
      await octokit.rest.issues.createComment({
        ...repo,
        issue_number: prNumber,
        body: `✅ **PR Description Review**\n\nScore: ${review.score}%\n\nGreat job! Your PR description is clear and complete.`
      });
    } else {
      await octokit.rest.issues.createComment({
        ...repo,
        issue_number: prNumber,
        body: `⚠️ **PR Description Review**\n\n${review.feedback}`
      });
    }
    core.info('✅ PR description reviewed and feedback posted.');
    console.log('🎉 Smart PR Description Reviewer completed successfully!');
    return;
  } catch (error) {
    console.error('❌ Error occurred:', error);
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

if (require.main === module) {
  run();
}

module.exports = { run };