import { useEditState, getPublishedId, useFormCallbacks, useValidationStatus, type ObjectInputProps } from "sanity";
export function TeamValuesPointer() {
  return <p>Edit the Values heading and cards in <strong>Team Values</strong> in the Studio sidebar.</p>;
}

export function TreatmentReadinessInput({ document }: { document: ObjectInputProps['value'] }) {
  const { validation, isValidating, revision } = useValidationStatus(typeof document?._id === 'string' ? document._id : '', 'service', true);
  const { onFieldGroupSelect, onPathOpen, onPathFocus } = useFormCallbacks();
  const checking = isValidating || !revision || revision !== document?._rev;
  const errors = validation.filter(marker => marker.level === 'error').filter((marker, index, all) => all.findIndex(other => other.message === marker.message && JSON.stringify(other.path) === JSON.stringify(marker.path)) === index);
  const titles: Record<string, string> = { slug: 'Page URL', title: 'Treatment title', shortDesc: 'Card and SEO summary', problem: 'Patient concern', solution: 'Treatment explanation', benefit: 'Short benefit', hero: 'Treatment introduction', headline: 'Headline', promise: 'Introduction', aboutHeading: 'About section heading', fullDescription: 'Treatment detail', aboutList: 'Treatment-specific list', benefits: 'Benefits', whyAesthedent: 'Why Aesthedent', process: 'Treatment steps', step: 'Step number', desc: 'Description', faqs: 'FAQs', q: 'Question', a: 'Answer', coverImage: 'Card image', bannerImage: 'Banner image', seo: 'Search and sharing' };
  const open = (path: typeof errors[number]['path']) => {
    const field = String(path[0]);
    const group = ['slug', 'title', 'shortDesc', 'problem', 'solution', 'benefit'].includes(field) ? 'summary' : field === 'faqs' ? 'questions' : ['benefits', 'whyAesthedent', 'process'].includes(field) ? 'process' : ['coverImage', 'bannerImage'].includes(field) ? 'images' : field === 'seo' ? 'seo' : 'detail';
    onFieldGroupSelect([], group); onPathOpen(path); onPathFocus(path);
  };
  const button = { padding: '8px 12px', border: '1px solid currentColor', borderRadius: 6, background: 'transparent', color: 'inherit', font: 'inherit', cursor: 'pointer' };
  return <div>
    <strong>{checking ? 'Checking treatment fields…' : errors.length ? `${errors.length} treatment field${errors.length === 1 ? '' : 's'} to finish` : 'Treatment fields passed validation'}</strong>
    <p>Complete the treatment headings, explanation, steps and FAQs. Have the clinic check the wording and image permissions before publishing. Drafts save automatically; use Publish to update the website.</p>
    <button type="button" style={button} onClick={() => open(!checking && errors[0] ? errors[0].path : ['hero', 'headline'])}>Review treatment fields</button>
    {!checking && errors.length > 0 && <details><summary>Show fields to fix</summary><ul>{errors.map(marker => <li key={JSON.stringify([marker.path, marker.message])}>
      <button type="button" style={button} onClick={() => open(marker.path)}>{marker.path.filter((part): part is string => typeof part === 'string').map(part => titles[part] ?? part).join(' → ') || 'Treatment content'}</button>: {marker.message}
    </li>)}</ul></details>}
  </div>;
}



export function DocumentStatusInput(props: ObjectInputProps) {

  const id = typeof props.value?._id === "string" ? props.value._id : "";

  const type = typeof props.value?._type === "string" ? props.value._type : "";

  const state = useEditState(getPublishedId(id), type);

  return <div><aside role="status" style={{ padding: 12, border: "1px solid currentColor", marginBottom: 16 }}>

    <strong>{!state.ready ? "Checking saved document…" : state.published ? state.draft ? "Published document with unpublished changes" : "Published document" : state.draft ? "Saved draft — not published" : "New document — not saved or published"}</strong>

    {type === 'service' ? <TreatmentReadinessInput document={props.value} /> : type === 'teamValues' ? <p>Publish to update the Team page. Remove all cards and publish to hide the section. Drafts do not change the website. Published changes may take about a minute to appear.</p> : type === "navigation" ? <p>Edit your links below, then click Publish. Saved drafts do not change the website. Published changes may take about a minute to appear.</p> : <><p>Website fallback content is not stored in this form. Empty optional overrides retain the existing website copy; required base fields must be complete for a document to replace fallback. Shared records are edited separately. Saving does not publish.</p>

    <p>Authenticated website preview must be enabled separately. Clinical review and image/review permissions are still required; technical validation is not content approval.</p></>}

  </aside>{props.renderDefault(props)}</div>;

}
