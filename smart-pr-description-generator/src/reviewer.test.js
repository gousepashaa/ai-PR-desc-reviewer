const { reviewDescription } = require('./reviewer');

jest.mock('openai', () => {
  return {
    Configuration: jest.fn(),
    OpenAIApi: jest.fn().mockImplementation(() => ({
      createCompletion: jest.fn()
    }))
  };
});

describe('reviewDescription', () => {
  beforeEach(() => {
    require('openai').OpenAIApi.mockClear();
  });

  it('returns score and feedback from the AI response', async () => {
    require('openai').OpenAIApi.mockImplementation(() => ({
      createCompletion: jest.fn().mockResolvedValue({
        data: { choices: [{ text: '{ "score": 75, "feedback": "Missing details about the API changes." }' }] }
      })
    }));
    const analysis = {
      prTitle: 'Add login feature',
      prBody: 'Implements login',
      branchName: 'feature/login',
      tickets: ['JIRA-123'],
      components: ['UI Components'],
      changedFiles: ['src/components/Login.js'],
      commitMessages: ['Add login page'],
      diffStats: { additions: 100, deletions: 10, files: 1 },
    };
    const prDescription = 'This PR adds a login page.';
    const result = await reviewDescription(analysis, prDescription, 'fake-api-key');
    expect(result).toEqual({ score: 75, feedback: 'Missing details about the API changes.' });
  });

  it('returns error feedback if AI returns invalid JSON', async () => {
    require('openai').OpenAIApi.mockImplementation(() => ({
      createCompletion: jest.fn().mockResolvedValue({
        data: { choices: [{ text: 'not a json' }] }
      })
    }));
    const analysis = { prTitle: '', prBody: '', branchName: '', tickets: [], components: [], changedFiles: [], commitMessages: [], diffStats: { additions: 0, deletions: 0, files: 0 } };
    const result = await reviewDescription(analysis, '', 'fake-api-key');
    expect(result).toEqual({ score: null, feedback: 'Could not parse AI response.' });
  });

  it('returns error feedback if AI throws error', async () => {
    require('openai').OpenAIApi.mockImplementation(() => ({
      createCompletion: jest.fn().mockRejectedValue(new Error('AI error'))
    }));
    const analysis = { prTitle: '', prBody: '', branchName: '', tickets: [], components: [], changedFiles: [], commitMessages: [], diffStats: { additions: 0, deletions: 0, files: 0 } };
    const result = await reviewDescription(analysis, '', 'fake-api-key');
    expect(result).toEqual({ score: null, feedback: expect.stringContaining('Error from AI:') });
  });

  it('returns null score if AI returns null', async () => {
    require('openai').OpenAIApi.mockImplementation(() => ({
      createCompletion: jest.fn().mockResolvedValue({ data: { choices: [{ text: '' }] } })
    }));
    const analysis = { prTitle: '', prBody: '', branchName: '', tickets: [], components: [], changedFiles: [], commitMessages: [], diffStats: { additions: 0, deletions: 0, files: 0 } };
    const result = await reviewDescription(analysis, '', 'fake-api-key');
    expect(result).toEqual({ score: null, feedback: 'Could not parse AI response.' });
  });
}); 