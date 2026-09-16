# StudiomWeb — Lovable preview export

This repository is a scaffold and in-progress rebuild of the Lovable preview site into a portable Next.js + TypeScript + Tailwind project.

What this initial commit includes
- Next.js + TypeScript scaffold
- Tailwind CSS setup
- Basic API routes:
  - /api/assistant — mock + Vertex AI scaffolding (reads GOOGLE_SERVICE_ACCOUNT_KEY)
  - /api/reservations — simple SQLite-backed reservations CRUD (using better-sqlite3)
- README and instructions to run locally

Running locally
1. Clone the repo
   git clone https://github.com/Stelilinka/studiomweb.git
2. Install dependencies
   npm install
3. Add env vars (for mock mode you can skip AI keys)
   - AI_PROVIDER=mock
   - (optional) AI_PROVIDER=google
   - GOOGLE_SERVICE_ACCOUNT_KEY=base64(service-account.json)
   - GOOGLE_PROJECT_ID=your-google-project
   - GOOGLE_AI_MODEL=models/chat-bison-001
   - SQLITE_FILE=./data/db.sqlite
4. Start dev server
   npm run dev

Next steps
- I will now extract assets from the Lovable preview and convert pages and components into React + Tailwind components in this repo. You will see commits for `assets-import`, `components`, `pages`, and `api`.

Security
- Do NOT commit secrets to the repository. Use GitHub Secrets / Vercel Environment variables.
