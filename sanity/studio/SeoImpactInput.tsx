import { useFormValue, type ObjectInputProps } from "sanity";
import { documentRoute, mapSeo } from "../lib/seo-mapping";

export function SeoImpactInput(props: ObjectInputProps) {
  const document = useFormValue([]), route = documentRoute(document), seo = mapSeo(props.value);
  return <div>{props.renderDefault(props)}<aside role="status" style={{ padding: 12 }}>
    <strong>Search visibility impact</strong>
    {route ? <p>Page: {route}. Canonical: {seo?.canonicalRoute ?? route}. Index: {seo?.index === false ? "No" : "Yes"}. Follow: {seo?.follow === false ? "No" : "Yes"}. Sitemap: {seo?.index === false || seo?.canonicalRoute && seo.canonicalRoute !== route ? "excluded" : "included"} after publication and cache refresh.</p> : <p>Shared defaults affect fallback copy and social images, never indexing or canonicals.</p>}
    <p>Empty overrides retain route-specific metadata. Canonical targets are validated against published pages before publication. Review the website preview and rendered metadata; invalid or ambiguous published overrides fall back safely.</p>
  </aside></div>;
}
