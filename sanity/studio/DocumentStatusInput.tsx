import { useEditState, getPublishedId, type ObjectInputProps } from "sanity";

export function DocumentStatusInput(props: ObjectInputProps) {
  const id = typeof props.value?._id === "string" ? props.value._id : "";
  const type = typeof props.value?._type === "string" ? props.value._type : "";
  const state = useEditState(getPublishedId(id), type);
  return <div><aside role="status" style={{ padding: 12, border: "1px solid currentColor", marginBottom: 16 }}>
    <strong>{!state.ready ? "Checking saved document…" : state.published ? state.draft ? "Published document with unpublished changes" : "Published document" : state.draft ? "Saved draft — not published" : "New document — not saved or published"}</strong>
    <p>Website fallback content is not stored in this form. Empty optional overrides retain the existing website copy; required base fields must be complete for a document to replace fallback. Shared records are edited separately. Saving does not publish.</p>
    <p>Authenticated website preview must be enabled separately. Clinical review and image/review permissions are still required; technical validation is not content approval.</p>
  </aside>{props.renderDefault(props)}</div>;
}
