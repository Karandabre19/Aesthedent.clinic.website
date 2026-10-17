import { useState } from "react";
import { useClient, useCurrentUser, type DocumentActionComponent } from "sanity";
import { requireSanityEnvironment } from "../env";
import { readinessIssues, reviewDigest } from "../lib/insight-review";
import { imageFromRecord } from "../lib/image";

class ReviewActionError extends Error {}

export const RecordInsightReviewAction: DocumentActionComponent = props => {
  const client = useClient({ apiVersion: requireSanityEnvironment().apiVersion });
  const user = useCurrentUser();
  const [busy, setBusy] = useState(false), [error, setError] = useState<string>();
  return {
    label: busy ? "Recording review…" : "Record clinician sign-off",
    disabled: busy || !props.draft || !user || props.id.startsWith("versions."),
    tone: "positive",
    onHandle: async () => {
      setBusy(true); setError(undefined);
      try {
        const draft = props.draft;
        if (!draft?._id.startsWith("drafts.") || !user?.id) throw new ReviewActionError("Save an ordinary draft and sign in before recording review.");
        // Read the saved revision; never certify a newer/older editor buffer.
        const saved = await client.getDocument(draft._id);
        if (!saved || saved._rev !== draft._rev) throw new ReviewActionError("The draft changed. Wait for saving to finish, review the latest version, and retry.");
        const seo = saved.seo && typeof saved.seo === "object" ? saved.seo : {};
        for (const image of [saved.coverImage, Reflect.get(seo, "socialImage")]) {
          if (!image || typeof image !== "object") continue;
          const asset = Reflect.get(image, "asset");
          const ref = asset && typeof asset === "object" ? Reflect.get(asset, "_ref") : undefined;
          const actual = typeof ref === "string" ? await client.getDocument(ref) : null;
          if (!imageFromRecord({ ...image, asset: actual })) throw new ReviewActionError("The selected cover or social image is unavailable or cannot be delivered. Check its asset and alternative text.");
        }
        const issues = readinessIssues(saved);
        if (issues.length) throw new ReviewActionError(issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join("\n"));
        const digest = await reviewDigest(saved);
        if (digest !== await reviewDigest(draft)) throw new ReviewActionError("Wait for pending changes to save before recording review.");
        const review = saved.review && typeof saved.review === "object" && !Array.isArray(saved.review) ? saved.review : {};
        await client.patch(saved._id).ifRevisionId(saved._rev).set({ editorialStatus: "ready", review: { ...review, digest, recordedBy: user.id, recordedAt: new Date().toISOString() } }).commit();
        props.onComplete();
      } catch (cause) {
        // Never display raw SDK responses, which can contain private payloads.
        setError(cause instanceof ReviewActionError ? cause.message : "Could not record review. Check access and whether another editor changed this draft, then retry.");
      } finally { setBusy(false); }
    },
    ...(error ? { dialog: { type: "confirm" as const, title: "Review was not recorded", message: error, onConfirm: () => setError(undefined), onCancel: () => setError(undefined) } } : {}),
  };
};
