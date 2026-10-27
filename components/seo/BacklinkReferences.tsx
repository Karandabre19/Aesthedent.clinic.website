import type { Backlink } from '../../sanity/lib/backlinks'

export function BacklinkReferences({ entries = [], locale = 'en' }: { entries?: readonly Backlink[]; locale?: string }) {
  if (!entries.length) return null
  return (
    <section aria-labelledby="backlink-references-heading" className="border-t border-[hsl(var(--color-primary)/0.12)] bg-[hsl(var(--background))] py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <h2 id="backlink-references-heading" className="text-2xl font-semibold text-[hsl(var(--color-primary))]">{locale === 'mr' ? 'बॅकलिंक संदर्भ' : 'Backlink references'}</h2>
        <ul className="mt-5 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(entry => <li key={entry.key} className="min-w-0">
            <a href={entry.url} className="block break-words rounded-lg border border-[hsl(var(--color-primary)/0.15)] px-4 py-3 text-sm text-[hsl(var(--color-primary))] underline underline-offset-4 transition-colors hover:bg-[hsl(var(--color-primary)/0.05)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">{entry.label}</a>
          </li>)}
        </ul>
      </div>
    </section>
  )
}
