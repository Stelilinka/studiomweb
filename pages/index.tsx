import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>StudiomWeb — Rebuild</title>
        <meta name="description" content="Recreated site from Lovable preview" />
      </Head>
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl font-bold mb-4">StudiomWeb — scaffold</h1>
          <p className="mb-6">This repository contains a Next.js + TypeScript + Tailwind scaffold and API routes. I will now import assets and convert pages from the Lovable preview to React components — you will see commits for assets-import, components, pages and api.</p>
          <div className="bg-gray-50 border rounded p-4">
            <p className="text-sm">To run locally:</p>
            <pre className="mt-2 p-3 bg-white rounded text-sm">git clone https://github.com/Stelilinka/studiomweb.git
npm install
npm run dev</pre>
          </div>
        </div>
      </main>
    </>
  )
}
