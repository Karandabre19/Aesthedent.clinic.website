// Server component - renders JSON-LD into the HTML at build time so it is
// present for crawlers with JS disabled. Pass a single object or an array;
// null/undefined entries are dropped (buildFaqSchema returns null when a page
// has no FAQs, and an empty FAQPage is invalid).
export default function JsonLd({ schema }) {
  const blocks = (Array.isArray(schema) ? schema : [schema]).filter(Boolean);
  if (!blocks.length) return null;

  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Validated CMS text can still contain a script-closing sequence.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  );
}
