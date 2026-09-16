import React from 'react'

export default function Footer(): JSX.Element {
  return (
    <footer className="w-full bg-gray-50 border-t mt-12">
      <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-gray-600">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <div className="font-semibold text-gray-900">Studio M</div>
            <div>© {new Date().getFullYear()} Studio M. Všechna práva vyhrazena.</div>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-pink-600">Ochrana soukromí</a>
            <a href="#" className="hover:text-pink-600">Podmínky</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
