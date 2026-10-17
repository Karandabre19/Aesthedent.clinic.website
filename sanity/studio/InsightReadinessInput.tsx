import { useEffect, useState } from "react";
import { useFormValue, type StringInputProps } from "sanity";
import { checkInsightReadiness } from "../lib/insight-review";

export function InsightReadinessInput(props: StringInputProps) {
  const document = useFormValue([]);
  const [result, setResult] = useState<{ document: unknown; messages: string[] }>();
  const messages = result && result.document === document ? result.messages : undefined;
  useEffect(() => {
    let active = true;
    checkInsightReadiness(document).then(issues => { if (active) setResult({ document, messages: [...new Set(issues.map(issue => issue.message))] }); })
      .catch(() => { if (active) setResult({ document, messages: ["Could not check readiness. Save the draft and retry; do not publish."] }); });
    return () => { active = false; };
  }, [document]);
  return <div>{props.renderDefault(props)}<div role="status" aria-live="polite" style={{ marginTop: 12 }}>
    <strong>{!messages ? "Checking editorial readiness…" : messages.length ? "Not ready to publish" : "Recorded review matches this content version"}</strong>
    <p>Drafts save normally. Technical checks do not prove clinical truth, originality or image permission. Complete the review evidence, then use “Record clinician sign-off”.</p>
    {messages && messages.length > 0 && <ul>{messages.map(message => <li key={message}>{message}</li>)}</ul>}
  </div></div>;
}
