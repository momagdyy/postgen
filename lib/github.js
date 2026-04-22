// Import the official GitHub API library
import { Octokit } from '@octokit/rest';

// Create GitHub client using your token from .env
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Function to get all failed workflow runs for a repo
export async function getFailedRuns(owner, repo) {
  
  // Call GitHub API to get workflow runs
  const response = await octokit.actions.listWorkflowRunsForRepo({
    owner,
    repo,
    status: 'failure',
    per_page: 10
  });

  // Extract only the data we need
  return response.data.workflow_runs.map(run => ({
    id: run.id,
    name: run.name,
    branch: run.head_branch,
    commit: run.head_sha.substring(0, 7),
    failed_at: run.updated_at,
    url: run.html_url
  }));
}

// Function to get the actual error logs from a failed run
export async function getRunLogs(owner, repo, runId) {

  // Get list of jobs inside this workflow run
  const jobs = await octokit.actions.listJobsForWorkflowRun({
    owner,
    repo,
    run_id: runId
  });

  // Find failed steps inside each job
  const failedSteps = [];

  for (const job of jobs.data.jobs) {
    if (job.conclusion === 'failure') {
      
      // Get each step that failed
      const failed = job.steps
        .filter(step => step.conclusion === 'failure')
        .map(step => ({
          job: job.name,
          step: step.name,
          started: step.started_at,
          finished: step.completed_at
        }));

      failedSteps.push(...failed);
    }
  }

  return failedSteps;
}