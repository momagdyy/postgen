# 🔴 PostGen

> AI-powered deployment postmortem generator for GitHub Actions

**Live Demo → [postgen-ten.vercel.app](https://postgen-ten.vercel.app)**

---

## What is PostGen?

PostGen automatically generates professional incident postmortem reports from GitHub Actions failures. Instead of spending hours writing incident reports manually, engineers get a structured report in seconds.

**Before PostGen:**
- Deployment fails at 2am
- Engineer fixes it under pressure
- Next day — sits down to write a full incident report from memory
- Opens blank Google Doc and starts from scratch = 2 hours of work

**After PostGen:**
- Deployment fails
- Open PostGen → enter repo name → click Generate
- Professional report ready in 10 seconds
- Engineer just reviews and exports = 5 minutes of work

---

## Features

- 🔍 **Automatic failure detection** — fetches last 10 failed runs from any public GitHub repo
- 🤖 **AI-powered reports** — generates structured postmortem using Llama 3 AI
- 📋 **Copy to clipboard** — instantly copy report to share with your team
- 📄 **Export as PDF** — download professional PDF report
- ⚡ **No setup required** — just enter a repo name and go

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, Tailwind CSS |
| Backend | Next.js API Routes |
| AI | Groq API (Llama 3.3 70B) |
| Data | GitHub Actions API |
| Hosting | Vercel |

---

## How It Works

User enters a GitHub repository (e.g. microsoft/vscode)
PostGen fetches the last 10 failed workflow runs via GitHub API
Failure data is sent to Llama 3 AI with a structured prompt
AI generates a professional postmortem report
User can copy or export as PDF


---

## Running Locally

### Prerequisites
- Node.js 18+
- GitHub Personal Access Token
- Groq API Key (free at console.groq.com)

### Setup

```bash
# Clone the repo
git clone https://github.com/momagdyy/postgen.git
cd postgen

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Add your keys to `.env.local`:
```env
GITHUB_TOKEN=your_github_token_here
GROQ_API_KEY=your_groq_api_key_here
```

```bash
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Roadmap

- [x] Public repository support
- [x] AI postmortem generation
- [x] PDF export
- [ ] GitHub OAuth — private repository support
- [ ] Save and share reports via unique URL
- [ ] Slack / Email notifications
- [ ] Support for GitLab and Bitbucket

---

## Why I Built This

DevOps engineers spend up to 30% of their week on repetitive tasks — writing incident reports is one of the most painful. PostGen eliminates that friction by automating the first draft so engineers can focus on fixing problems, not documenting them.

---

## License

MIT — free to use and modify

---

<p align="center">Built by <a href="https://github.com/momagdyy">Mohamed Magdy</a></p>