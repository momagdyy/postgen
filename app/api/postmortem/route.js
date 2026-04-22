import { getFailedRuns } from '@/lib/github';
import { generatePostmortem } from '@/lib/ai';

export async function GET(request) {

  // Get owner and repo from the URL query
  // Example: /api/postmortem?owner=microsoft&repo=vscode
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');

  // Make sure both values exist
  if (!owner || !repo) {
    return Response.json(
      { error: 'Please provide owner and repo' },
      { status: 400 }
    );
  }

  try {
    // Step 1 — fetch failed runs from GitHub
    const runs = await getFailedRuns(owner, repo);

    if (runs.length === 0) {
      return Response.json({ message: 'No failed runs found!' });
    }

    // Step 2 — generate AI postmortem report
    const report = await generatePostmortem(runs, owner, repo);

    // Step 3 — return the result
    return Response.json({
      repo: `${owner}/${repo}`,
      total_failures: runs.length,
      report
    });

  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}