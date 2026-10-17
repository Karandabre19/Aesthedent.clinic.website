import { draftMode } from "next/headers";

export async function DraftNotice() {
  if (!(await draftMode()).isEnabled) return null;
  return <aside role="status" style={{ position: "fixed", zIndex: 100000, bottom: 12, left: 12, maxWidth: 420, padding: 16, background: "#fff3c4", color: "#242424", border: "2px solid #745400" }}>
    <strong>Unpublished website preview</strong><p>Saved drafts may be incomplete or clinically unapproved. This is not the public website. Reload to see newly saved changes.</p>
    <form method="post" action="/api/draft-mode/disable"><button type="submit">Exit preview</button></form>
  </aside>;
}
