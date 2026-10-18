import { useFormValue, type ObjectInputProps } from "sanity";
import { SITE_URL } from "../../lib/schema.js";
import { documentRoute, mapSeo } from "../lib/seo-mapping";
import { runSeoChecks, truncateForPreview, SEO_DESCRIPTION_RANGE, SEO_TITLE_RANGE } from "../lib/seo-checks";

type DocumentValue = Record<string, unknown> & { _type?: string; slug?: { current?: string } };
const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** First paragraph of Portable Text, for the "keyword in opening text" check. */
function firstBlockText(value: unknown): string {
  if (!Array.isArray(value)) return "";
  const block = value.find(item => item && typeof item === "object" && Reflect.get(item, "_type") === "block");
  const children = block ? Reflect.get(block, "children") : undefined;
  return Array.isArray(children) ? children.map(child => text(Reflect.get(Object(child), "text"))).join("") : "";
}

/** The website's own title/description/opening text used when SEO fields are left empty. */
function fallbacks(doc: DocumentValue) {
  if (doc._type === "service") return { title: text(doc.title), description: text(doc.shortDesc), body: text(doc.problem) || text(doc.fullDescription) || text(doc.shortDesc) };
  if (doc._type === "insight") return { title: text(doc.metaTitle) || text(doc.title), description: text(doc.metaDescription) || text(doc.excerpt), body: text(doc.excerpt) || firstBlockText(doc.body) };
  return { title: "", description: "", body: undefined };
}

const muted = { color: "var(--card-muted-fg-color, #6e7683)", fontSize: 12, margin: 0 };
const copy = { fontSize: 13, margin: 0, lineHeight: 1.5 };
const box = { border: "1px solid var(--card-border-color, #e3e4e8)", borderRadius: 6, padding: 12, display: "grid", gap: 8 } as const;

export function SeoImpactInput(props: ObjectInputProps) {
  const document = (useFormValue([]) ?? {}) as DocumentValue, route = documentRoute(document), seo = mapSeo(props.value);
  const shared = document._type === "seoSettings";
  const fallback = fallbacks(document);
  const rawTitle = seo?.metaTitle ?? fallback.title;
  const title = rawTitle && route !== "/" && !rawTitle.includes("Aesthedent") ? `${rawTitle} | Aesthedent` : rawTitle;
  const description = seo?.metaDescription ?? fallback.description;
  const checks = runSeoChecks({
    keyword: seo?.focusKeyword, title, description,
    ...(document.slug ? { slug: document.slug.current ?? "" } : {}),
    ...(fallback.body !== undefined ? { body: fallback.body } : {}),
  });

  return <div style={{ display: "grid", gap: 16 }}>
    <section role="status" aria-label="Search preview and checks" style={box}>
      <p style={{ ...copy, fontWeight: 600 }}>{shared ? "Preview of the site-wide default listing" : "Google preview"}</p>
      <div style={box}>
        <p style={muted}>{SITE_URL.replace(/^https?:\/\//, "")}{route && route !== "/" ? route : ""}</p>
        <p style={{ ...copy, fontSize: 17, color: "var(--card-link-fg-color, #1a0dab)" }}>{truncateForPreview(title || "Empty — the page's existing website title is used", SEO_TITLE_RANGE.max)}</p>
        <p style={copy}>{truncateForPreview(description || "Empty — the page's existing website description is used", SEO_DESCRIPTION_RANGE.max)}</p>
      </div>
      {!shared && <>
        <p style={{ ...copy, fontWeight: 600 }}>Checks{seo?.focusKeyword ? ` for “${seo.focusKeyword}”` : ""}</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
          {checks.map(check => <li key={check.id} style={{ ...copy, display: "flex", gap: 8, alignItems: "baseline" }}>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "1px 6px", borderRadius: 4, whiteSpace: "nowrap", background: check.status === "good" ? "rgba(61,170,107,0.18)" : "rgba(230,160,40,0.22)" }}>{check.status === "good" ? "Good" : "Improve"}</span>
            <span>{check.message}</span>
          </li>)}
        </ul>
      </>}
      <p style={muted}>
        <strong>Search visibility: </strong>
        {route ? `Page ${route}. Canonical: ${seo?.canonicalRoute ?? route}. Index: ${seo?.index === false ? "No" : "Yes"}. Follow: ${seo?.follow === false ? "No" : "Yes"}. Sitemap: ${seo?.index === false || seo?.canonicalRoute && seo.canonicalRoute !== route ? "excluded" : "included"} after publication and cache refresh.` : "Shared defaults affect fallback copy and social images, never indexing or canonicals."}
        {" "}Empty overrides keep the page's existing metadata; invalid or ambiguous published overrides fall back safely.
      </p>
    </section>
    {props.renderDefault(props)}
  </div>;
}
