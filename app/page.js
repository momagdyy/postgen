'use client';

import { useState } from 'react';

export default function Home() {

  // Stores what the user typed in the input box
  const [repo, setRepo] = useState('');

  // Stores the report returned from the API
  const [report, setReport] = useState(null);

  // Stores error messages if something goes wrong
  const [error, setError] = useState(null);

  // True while waiting for the API response
  const [loading, setLoading] = useState(false);

  // Stores number of failures found
  const [totalFailures, setTotalFailures] = useState(0);

  // Stores how many failures to fetch
  const [limit, setLimit] = useState(10);

  // This runs when user clicks Generate Report
  async function handleGenerate() {

    // Reset previous results
    setError(null);
    setReport(null);

    // Validate input — must contain a slash like "microsoft/vscode"
    if (!repo.includes('/')) {
      setError('Please enter repo in format: owner/repo (e.g. microsoft/vscode)');
      return;
    }

    // Split "microsoft/vscode" into owner and repo
    const [owner, repoName] = repo.split('/');

    // Show loading state
    setLoading(true);

    try {
      // Call your Next.js API route with limit parameter
      const response = await fetch(
        `/api/postmortem?owner=${owner}&repo=${repoName}&limit=${limit}`
      );

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setReport(data.report);
        setTotalFailures(data.total_failures);
      }

    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      // Always hide loading when done
      setLoading(false);
    }
  }

  // Copy report to clipboard
  function handleCopy() {
    navigator.clipboard.writeText(report);
    alert('Report copied to clipboard!');
  }

  // Export report as PDF
  function handleExportPDF() {
    const { jsPDF } = require('jspdf');

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(220, 50, 50);
    doc.text('PostGen — Incident Postmortem Report', 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text(`Repository: ${repo}`, 20, 32);
    doc.text(`Total Failures: ${totalFailures}`, 20, 40);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 48);

    doc.setDrawColor(220, 50, 50);
    doc.line(20, 52, 190, 52);

    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);

    const lines = doc.splitTextToSize(
      report.replace(/\*\*/g, '').replace(/##/g, ''),
      170
    );

    doc.text(lines, 20, 62);
    doc.save(`postmortem-${repo.replace('/', '-')}.pdf`);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">

      {/* Header */}
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-2">
            🔴 PostGen
          </h1>
          <p className="text-gray-400 text-lg">
            AI-powered deployment postmortem generator
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Enter any public GitHub repository to generate an incident report
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
          <label className="block text-sm text-gray-400 mb-2">
            GitHub Repository
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g. microsoft/vscode"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition"
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>

          {/* Failure limit selector */}
          <div className="mt-4 flex items-center gap-3">
            <label className="text-gray-400 text-sm">
              Fetch last:
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 transition"
            >
              <option value={5}>5 failures</option>
              <option value={10}>10 failures</option>
              <option value={20}>20 failures</option>
              <option value={30}>30 failures</option>
            </select>
          </div>

          {/* Quick test buttons */}
          <div className="mt-3 flex gap-2 flex-wrap">
            <span className="text-gray-600 text-xs mt-1">Try:</span>
            {['microsoft/vscode', 'vercel/next.js', 'facebook/react'].map(r => (
              <button
                key={r}
                onClick={() => setRepo(r)}
                className="text-xs text-gray-500 hover:text-red-400 border border-gray-800 hover:border-red-800 px-2 py-1 rounded-lg transition"
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-950 border border-red-800 text-red-400 rounded-xl p-4 mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4 animate-pulse">⚙️</div>
            <p className="text-gray-400">Fetching failures and generating report...</p>
            <p className="text-gray-600 text-sm mt-1">This takes 5-10 seconds</p>
          </div>
        )}

        {/* Report Section */}
        {report && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            {/* Report Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  📋 Postmortem Report
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {totalFailures} failures detected in{' '}
                  <span className="text-red-400">{repo}</span>
                </p>
              </div>

              {/* Export Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-4 py-2 rounded-xl transition"
                >
                  Copy Report
                </button>
                <button
                  onClick={handleExportPDF}
                  className="bg-red-700 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-xl transition"
                >
                  Export PDF
                </button>
              </div>
            </div>

            {/* Report Content */}
            <div className="prose prose-invert max-w-none">
              {report.split('\n').map((line, i) => {

                if (line.startsWith('## ')) {
                  return (
                    <h3 key={i} className="text-red-400 font-bold text-lg mt-6 mb-2">
                      {line.replace('## ', '')}
                    </h3>
                  );
                }

                if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <p key={i} className="text-white font-semibold mt-4">
                      {line.replace(/\*\*/g, '')}
                    </p>
                  );
                }

                if (line.match(/^\d+\./)) {
                  return (
                    <p key={i} className="text-gray-300 ml-4 mt-1">
                      {line}
                    </p>
                  );
                }

                if (line.startsWith('- ')) {
                  return (
                    <p key={i} className="text-gray-400 ml-4 mt-1">
                      • {line.replace('- ', '')}
                    </p>
                  );
                }

                if (line.trim() === '') {
                  return <br key={i} />;
                }

                return (
                  <p key={i} className="text-gray-300 mt-1">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}