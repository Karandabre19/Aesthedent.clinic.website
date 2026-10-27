import { useState } from "react";
import { getPublishedId, useClient, useCurrentUser, useDocumentOperation, useFormValue, type DocumentActionComponent, type DocumentActionDescription, type DocumentActionProps, type ObjectInputProps, type SanityDocument } from "sanity";
import { requireSanityEnvironment } from "../env";
import { readinessIssues, reviewDigest, insightFieldLabel, insightFieldErrors, insightStudioReadiness } from "../lib/insight-review";
import { imageFromRecord } from "../lib/image";

class ReviewActionError extends Error {}

function useInsightReviewAction(props: Pick<DocumentActionProps, 'id' | 'type' | 'draft' | 'onComplete'>): DocumentActionDescription {
  const client = useClient({ apiVersion: requireSanityEnvironment().apiVersion });
  const user = useCurrentUser();
  const { patch } = useDocumentOperation(props.id, props.type);
  const [busy, setBusy] = useState(false), [error, setError] = useState<string>();
  const disabled = busy || !!patch.disabled || !props.draft || !user || props.id.startsWith("versions.");
  return {
    label: busy ? "Saving doctor’s approval…" : "Save doctor’s approval",
    group: ['default', 'paneActions'],
    disabled,
    tone: "positive",
    onHandle: async () => {
      if (disabled) return;
      setBusy(true); setError(undefined);
      try {
        const draft = props.draft;
        if (!draft?._id.startsWith("drafts.") || !user?.id) throw new ReviewActionError("Sign in and wait for this article to save as a draft. Then choose Save doctor’s approval again.");
        // Read the saved revision; never certify a newer/older editor buffer.
        const saved = await client.getDocument(draft._id);
        if (!saved || saved._rev !== draft._rev) throw new ReviewActionError("The draft changed. Wait for saving to finish, review the latest version, and retry.");
        const seo = saved.seo && typeof saved.seo === "object" ? saved.seo : {};
        for (const image of [saved.coverImage, Reflect.get(seo, "socialImage")]) {
          if (!image || typeof image !== "object") continue;
          const asset = Reflect.get(image, "asset");
          const ref = asset && typeof asset === "object" ? Reflect.get(asset, "_ref") : undefined;
          const actual = typeof ref === "string" ? await client.getDocument(ref) : null;
          if (!imageFromRecord({ ...image, asset: actual })) throw new ReviewActionError(`${image === saved.coverImage ? "Article cover" : "Social sharing image"}: the selected image is unavailable or cannot be delivered. Select an available image and check its alternative text and crop.`);
        }
        const issues = readinessIssues(saved);
        if (issues.length) {
          const fields = ["title", "excerpt", "metaTitle", "metaDescription", "listingTitle", "listingExcerpt", "category", "date", "modifiedAt", "readTimeMinutes", "featured", "body", "sources", "review", "seo"];
          const messages = fields.flatMap(field => {
            const errors = insightFieldErrors(field, saved[field]);
            return errors === true ? [] : errors.map(issue => `${insightFieldLabel([field, ...issue.path])}: ${issue.message}`);
          });
          if (issues.some(issue => issue.path[0] === "slug")) messages.push("Article web address: Enter the title, then generate a lowercase address using hyphens.");
          const cross = (await insightStudioReadiness(saved)).filter(issue => issue.path[0] !== "editorialStatus");
          throw new ReviewActionError([...new Set([...messages, ...cross.map(issue => `${insightFieldLabel(issue.path)}: ${issue.message}`)])].join("\n") || "Finish the article and fill in Doctor’s approval before choosing Save doctor’s approval.");
        }
        const digest = await reviewDigest(saved);
        if (digest !== await reviewDigest(draft)) throw new ReviewActionError("Wait for pending changes to save before recording review.");
        const review = saved.review && typeof saved.review === "object" && !Array.isArray(saved.review) ? saved.review : {};
        await client.patch(saved._id).ifRevisionId(saved._rev).set({ editorialStatus: "ready", review: { ...review, digest, recordedBy: user.id, recordedAt: new Date().toISOString() } }).commit();
        props.onComplete();
      } catch (cause) {
        // Never display raw SDK responses, which can contain private payloads.
        setError(cause instanceof ReviewActionError ? cause.message : "The doctor’s approval could not be saved. Make sure you are signed in and connected to the internet. Wait for any article changes to save, then try again.");
      } finally { setBusy(false); }
    },
    ...(error ? { dialog: { type: "confirm" as const, message: `Doctor’s approval was not saved.\n${error}`, onConfirm: () => setError(undefined), onCancel: () => setError(undefined) } } : {}),
  };
}

/** The same guarded save is available in both menus and beside the review fields. */
export const RecordInsightReviewAction: DocumentActionComponent = props => useInsightReviewAction(props);

export function InsightReviewInput(props: ObjectInputProps) {
  const document = useFormValue([]) as SanityDocument | undefined;
  const action = useInsightReviewAction({
    id: getPublishedId(document?._id ?? 'new-insight'), type: 'insight',
    draft: document?._id.startsWith('drafts.') ? document : null, onComplete: () => {},
  });
  const disabled = !!props.readOnly || !!action.disabled;
  return <div>
    {props.renderDefault(props)}
    <div style={{ marginTop: 16 }}>
      <p>After the doctor has checked this exact article, complete the approval details above and press the button below. Wait for article changes to finish saving first.</p>
      <button type="button" disabled={disabled} style={{ padding: '10px 14px', font: 'inherit', fontWeight: 600, border: '1px solid currentColor', borderRadius: 6, background: 'transparent', color: 'inherit', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.55 : 1, outlineOffset: 3 }} onClick={() => { if (!disabled) action.onHandle?.(); }}>{action.label}</button>
      <p>This saves the doctor’s approval to your draft. Publishing is a separate step. Changing the article requires the doctor to check it again.</p>
      {action.dialog && action.dialog.type === 'confirm' && <div role="alert" style={{ whiteSpace: 'pre-wrap' }}>{action.dialog.message}</div>}
    </div>
  </div>;
}
