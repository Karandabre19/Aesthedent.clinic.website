"use client";

import { defineConfig, useDocumentOperation, type DocumentActionComponent } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { requireSanityEnvironment } from "./sanity/env";
import { singletonNames, doctorKeys, doctorWebsiteFields } from "./sanity/lib/page-mapping";
import { DOCTORS } from './lib/clinic';
import { RecordInsightReviewAction } from "./sanity/studio/RecordInsightReviewAction";
import { RecordHoursConfirmationAction } from './sanity/studio/RecordHoursConfirmationAction';
import { Plus } from 'lucide-react';

const { projectId, dataset } = requireSanityEnvironment();
const fixedDocuments: readonly string[] = [...singletonNames, 'clinicAvailability'];

const visibleDeleteActions = new WeakMap<DocumentActionComponent, DocumentActionComponent>();

/** Keep native permissions/reference checks and confirmation; expose Delete in both menus. */
function visibleContentDelete(Action: DocumentActionComponent): DocumentActionComponent {
  const cached = visibleDeleteActions.get(Action);
  if (cached) return cached;
  const DeleteContentAction: DocumentActionComponent = props => {
    const state = Action(props);
    return state ? { ...state, group: ['default', 'paneActions'], label: state.label === 'Delete' ? props.type === 'service' ? 'Delete treatment' : 'Delete article' : state.label } : state;
  };
  DeleteContentAction.action = Action.action;
  visibleDeleteActions.set(Action, DeleteContentAction);
  return DeleteContentAction;
}

export function missingDoctorWebsiteFields(document: Record<string, unknown>): Record<string, unknown> {
  const slug = document.slug;
  const values = doctorWebsiteFields(slug && typeof slug === 'object' && 'current' in slug ? slug.current : undefined);
  if (!values) return {};
  return Object.fromEntries(Object.entries(values).filter(([field]) => document[field] == null || Array.isArray(document[field]) && document[field].length === 0));
}

export const FillDoctorDetailsAction: DocumentActionComponent = props => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const fields = missingDoctorWebsiteFields(props.draft ?? props.published ?? {});
  const disabled = 'readOnly' in props && props.readOnly === true || !!patch.disabled || Object.keys(fields).length === 0;
  return {
    label: 'Copy missing qualifications and specializations',
    group: ['default', 'paneActions'],
    title: 'Copies existing website details into empty lists. Your saved entries are kept; review the copied details before publishing.',
    disabled,
    onHandle: () => { if (disabled) return; patch.execute([{ set: fields }]); props.onComplete(); },
  };
};

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
    S.divider(),
    ...[{ type: 'service', title: 'Treatments — add or edit', action: 'Add new treatment' }, { type: 'insight', title: 'Insights — add or edit', action: 'Add new article' }].map(item => S.listItem().id(item.type).title(item.title).schemaType(item.type).child(
      S.documentTypeList(item.type).title(item.title)
        .menuItems([S.menuItem().title(item.action).icon(Plus).intent({ type: 'create', params: { type: item.type, template: item.type } }).showAsAction(true)])
        .initialValueTemplates([S.initialValueTemplateItem(item.type)]),
    )),
    ...S.documentTypeListItems().filter((item) => !fixedDocuments.some((name) => name === item.getId()) && !['service', 'insight'].includes(item.getId() ?? '')),
  ]) })],
  document: {
    actions: (actions, context) => {
      if (context.schemaType === 'doctor') return [...actions, FillDoctorDetailsAction];
      if (context.schemaType === 'service' || context.schemaType === 'insight') {
        const contentActions = actions.map(action => action.action === 'delete' ? visibleContentDelete(action) : action);
        return context.schemaType === 'insight' ? [...contentActions, RecordInsightReviewAction] : contentActions;
      }
      return context.schemaType === 'clinicAvailability' ? [...actions.filter(action => action.action !== 'duplicate'), RecordHoursConfirmationAction] : fixedDocuments.some(name => name === context.schemaType) ? actions.filter(action => action.action !== 'duplicate') : actions;
    },
    // Retain templates for singleton initialization, but never offer arbitrary singleton IDs.
    newDocumentOptions: (options) => options.filter((option) => !fixedDocuments.some((name) => name === option.templateId)),
  },
  schema: {
    types: schemaTypes,
    templates: previous => [...previous, ...doctorKeys.map(key => ({
      id: `doctor-${key}`, schemaType: 'doctor', title: `${DOCTORS[key].name} — existing website details`,
      value: () => ({ slug: { _type: 'slug', current: key }, ...doctorWebsiteFields(key) }),
    }))],
  },
});
