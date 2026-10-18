"use client";

import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { requireSanityEnvironment } from "./sanity/env";
import { singletonNames } from "./sanity/lib/page-mapping";
import { RecordInsightReviewAction } from "./sanity/studio/RecordInsightReviewAction";
import { RecordHoursConfirmationAction } from './sanity/studio/RecordHoursConfirmationAction';

const { projectId, dataset } = requireSanityEnvironment();
const fixedDocuments: readonly string[] = [...singletonNames, 'clinicAvailability'];

export default defineConfig({
  name: "aesthedent",
  title: "Aesthedent CMS",
  basePath: "/aesthedent-studio",
  projectId,
  dataset,
  // Enabling Presentation may create Sanity preview-secret records. Leave off
  // until authenticated preview activation is explicitly authorized.
  plugins: [...(process.env.NEXT_PUBLIC_SANITY_PREVIEW_ENABLED === "true" ? [presentationTool({ previewUrl: { initial: "/", previewMode: { enable: "/api/draft-mode/enable" } } })] : []), structureTool({ structure: (S) => S.list().title("Content").items([
    ...fixedDocuments.filter(name => schemaTypes.some(type => type.name === name)).map((name) => {
      const item = S.listItem().title(schemaTypes.find(type => type.name === name)?.title ?? name).child(S.document().schemaType(name).documentId(name).initialValueTemplate(name));
      return name === 'clinicAvailability' ? item.id(name) : item;
    }),
    S.divider(), ...S.documentTypeListItems().filter((item) => !fixedDocuments.some((name) => name === item.getId())),
  ]) })],
  document: {
    actions: (actions, context) => context.schemaType === 'clinicAvailability' ? [...actions.filter(action => action.action !== 'duplicate'), RecordHoursConfirmationAction] : fixedDocuments.some((name) => name === context.schemaType) ? actions.filter((action) => action.action !== "duplicate") : context.schemaType === "insight" ? [...actions, RecordInsightReviewAction] : actions,
    // Retain templates for singleton initialization, but never offer arbitrary singleton IDs.
    newDocumentOptions: (options) => options.filter((option) => !fixedDocuments.some((name) => name === option.templateId)),
  },
  schema: {
    types: schemaTypes,
  },
});
