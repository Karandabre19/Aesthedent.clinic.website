import { defineType, getPublishedId } from "sanity";
import { presentationDefinitions, presentationPageNames, presentationSpecs } from "../lib/presentation-definitions";
import { sectionFields } from "./editorial-fields";

export const presentationPageTypes = presentationPageNames.map(name => defineType({
  name, title: presentationDefinitions[name].title, type: "document",
  description: `Presentation of ${presentationDefinitions[name].route}. Shared records, contact values, clinical facts and operational behavior have separate owners. Empty optional copy retains the existing website text.`,
  groups: presentationSpecs(name).map((section, index) => ({ name: section.name, title: section.title, default: index === 0 })),
  fields: sectionFields(presentationSpecs(name)),
  validation: rule => rule.custom((_, context) => !context.document?._id || getPublishedId(context.document._id) === name || "Use this page's fixed document in Structure."),
  preview: { prepare: () => ({ title: presentationDefinitions[name].title, subtitle: presentationDefinitions[name].route }) },
}));
