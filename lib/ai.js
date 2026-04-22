// Import Groq SDK
import Groq from 'groq-sdk';

// Create client using your API key from .env
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function generatePostmortem(failedRuns, owner, repo) {

  // Build a clear description of the failures
  const failureDetails = failedRuns.map(run => `
    - Workflow: ${run.name}
    - Branch: ${run.branch}
    - Commit: ${run.commit}
    - Failed at: ${run.failed_at}
    - URL: ${run.url}
  `).join('\n');

  // Prompt we send to the AI
  const prompt = `
    You are a senior DevOps engineer writing a professional incident postmortem report.
    
    Repository: ${owner}/${repo}
    
    The following deployment failures occurred recently:
    ${failureDetails}
    
    Write a clear, structured postmortem report with these sections:
    
    1. SUMMARY
       - What failed, when, and how many times
    
    2. TIMELINE
       - Chronological list of failures
    
    3. AFFECTED COMPONENTS
       - Which workflows and branches were affected
    
    4. PROBABLE CAUSES
       - Based on branch names and timing, what likely caused this
    
    5. ACTION ITEMS
       - Concrete steps to prevent this happening again
    
    Keep it professional but easy to read.
    Use simple English, not overly technical.
  `;

  // Send to Groq — using Llama 3 model which is free
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'user', content: prompt }
    ],
    max_tokens: 1000
  });

  // Extract text from response
  return response.choices[0].message.content;
}