const { Configuration, OpenAIApi } = require('openai');

async function reviewDescription(analysis, prDescription, apiKey) {
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  // Prepare context summary
  const contextSummary = `
Code Change Summary:
- PR Title: ${analysis.prTitle}
- Branch Name: ${analysis.branchName}
- PR Type: ${analysis.prType}
- Related Tickets: ${analysis.tickets.join(', ') || 'None identified'}
- Components Affected: ${analysis.components.join(', ')}
- Files Changed: ${analysis.changedFiles.join(', ')}
- Commit Messages:\n${analysis.commitMessages.map(msg => `  - ${msg}`).join('\n')}
- Total Changes: +${analysis.diffStats.additions}, -${analysis.diffStats.deletions} across ${analysis.diffStats.files} files
`;

  // Prepare prompt
  const prompt = `
You are a senior code reviewer. Here is a summary of the code changes for a pull request:
${contextSummary}

Here is the PR description written by the developer:
"""
${prDescription}
"""

Does the PR description accurately and completely explain the code changes? Rate the description from 0 to 100% for completeness, accuracy, and clarity. If anything important is missing, unclear, or misleading, list those points. Respond in the following JSON format:
{
  "score": <number>,
  "feedback": <string>
}
`;

  try {
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 500,
      temperature: 0.2,
    });
    // Try to parse the first JSON object in the response
    const match = response.data.choices[0].text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return { score: null, feedback: 'Could not parse AI response.' };
  } catch (error) {
    console.error('Error reviewing PR description:', error);
    return { score: null, feedback: 'Error from AI: ' + error.message };
  }
}
//testing
module.exports = { reviewDescription }; 