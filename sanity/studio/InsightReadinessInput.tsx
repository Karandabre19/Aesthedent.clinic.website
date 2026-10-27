import { insert, set, setIfMissing, useFormCallbacks, useFormValue, useValidationStatus, type PortableTextInputProps, type SlugInputProps, type StringInputProps } from "sanity";
import { insightFieldLabel } from "../lib/insight-review";
import { insights } from "../../lib/insights.js";

/** Insert a native heading without replacing existing text or touching approval evidence. */
export function InsightBodyInput(props: PortableTextInputProps) {
  const full = (props.value?.length ?? 0) >= 200;
  const id = `${props.id}-section-heading`;
  return <div>
    <div role="group" aria-label="Add a section heading" style={{ marginBottom: 12 }}>
      <label htmlFor={id}>Section heading</label>
      <p id={`${id}-help`}>Enter the name of a section, then add it to the article. Continue writing below the new heading.</p>
      <input id={id} type="text" aria-describedby={`${id}-help`} disabled={props.readOnly || full} style={{ width: "100%", padding: 10, font: "inherit", color: "inherit", background: "var(--card-bg-color)", border: "1px solid var(--card-border-color)", borderRadius: 4 }} onInput={event => event.currentTarget.setCustomValidity("")} />
      <button type="button" disabled={props.readOnly || full} style={{ marginTop: 8, padding: "8px 12px", font: "inherit" }} onClick={event => {
        if (props.readOnly || full) return;
        const input = event.currentTarget.parentElement?.querySelector<HTMLInputElement>("input");
        const text = input?.value.trim();
        if (!input || !text) {
          input?.setCustomValidity("Enter the section name first.");
          input?.reportValidity();
          return;
        }
        const heading = { _type: "block", _key: crypto.randomUUID().replaceAll("-", ""), style: "h2", markDefs: [], children: [{ _type: "span", _key: crypto.randomUUID().replaceAll("-", ""), text, marks: [] }] };
        props.onChange([setIfMissing([]), insert([heading], "after", [-1])]);
        input.value = "";
        props.onPathFocus([{ _key: heading._key }]);
      }}>Add section heading</button>
      {full && <p>The article has reached 200 blocks. Change an existing paragraph to Section heading using the text-style menu.</p>}
    </div>
    {props.renderDefault(props)}
  </div>;
}

export function InsightArticleInput(props: SlugInputProps) {
  const current = props.value?.current ?? "";
  const known = insights.some(article => article.slug === current);
  return <div>
    {props.renderDefault(props)}
    <select id={`${props.elementProps.id}-existing`} aria-describedby={props.elementProps['aria-describedby']} value={known ? current : ''} disabled={props.readOnly} aria-label="Or choose an existing article" style={{ width: "100%", marginTop: 8, padding: 12, font: "inherit", color: "inherit", background: "var(--card-bg-color)", border: "1px solid var(--card-border-color)", borderRadius: 4 }} onChange={event => {
      const selected = event.currentTarget.value;
      if (props.readOnly || !insights.some(article => article.slug === selected)) return;
      props.onChange([setIfMissing({ _type: "slug" }), set(selected, ["current"])]);
    }}>
      <option value="" disabled>Or choose an existing article…</option>
      {insights.map(article => <option key={article.slug} value={article.slug}>{article.title}</option>)}
    </select>
    {current && <p>Website page: <code>/insights/{current}</code></p>}
  </div>;
}

const groups = [
  { name: "article", title: "Article and listing" },
  { name: "body", title: "Article body" },
  { name: "review", title: "Doctor’s approval" },
  { name: "seo", title: "Search and social sharing" },
] as const;
function groupFor(field: unknown) {
  return field === "body" ? "body" : ["sources", "review", "authorKey", "editorialStatus"].includes(String(field)) ? "review" : ["seo", "metaTitle", "metaDescription"].includes(String(field)) ? "seo" : "article";
}

export function InsightReadinessInput(props: StringInputProps) {
  const document = useFormValue([]) as { _id?: string; _rev?: string } | undefined;
  const { validation, isValidating, revision } = useValidationStatus(document?._id ?? "", "insight", true);
  const { onFieldGroupSelect, onPathOpen, onPathFocus } = useFormCallbacks();
  // Use Publish's validation stream, including asynchronous access checks.
  const checking = isValidating || !revision || revision !== document?._rev;
  const errors = validation.filter(marker => marker.level === "error").filter((marker, index, all) => all.findIndex(other => other.message === marker.message && JSON.stringify(other.path) === JSON.stringify(marker.path)) === index);
  return <div>{props.renderDefault(props)}<div role="status" aria-live="polite" style={{ marginTop: 12 }}>
    <strong>{checking ? "Checking what is left to do…" : errors.length ? `${errors.length} thing${errors.length === 1 ? "" : "s"} to finish before you can publish` : "All checks passed for this saved article"}</strong>
    <p>You can leave this article and come back later; your draft saves automatically. Before publishing, finish the text, add the references the doctor checked, and complete Doctor’s approval.</p>
    <p>After the doctor has approved this article, click “Save doctor’s approval” below the Doctor’s approval fields, or use the document actions menu. Changing the status to Ready does not save the doctor’s approval. Wait for saving to finish before publishing.</p>
  </div>
    {!checking && errors.length > 0 && <details>
      <summary>Show me what to fix</summary>
      {groups.map(group => {
        const markers = errors.filter(marker => groupFor(marker.path[0]) === group.name);
        return markers.length > 0 && <section key={group.name} aria-label={group.title}>
          <h4>{group.title}</h4><ul>{markers.map(marker => <li key={JSON.stringify([marker.path, marker.message])}>
            <button type="button" style={{ color: "inherit", background: "transparent", border: 0, textDecoration: "underline", cursor: "pointer", padding: 0, textAlign: "left" }} onClick={() => {
              onFieldGroupSelect([], group.name);
              onPathOpen(marker.path);
              onPathFocus(marker.path);
            }}>{insightFieldLabel(marker.path)}</button>: {marker.message}
          </li>)}</ul>
        </section>;
      })}
    </details>}
  </div>;
}
