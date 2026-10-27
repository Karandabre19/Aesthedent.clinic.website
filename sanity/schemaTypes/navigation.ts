import { defineArrayMember, defineField, defineType, getPublishedId, type ArrayRule } from "sanity";
import { navigationDefaults } from "../lib/navigation-data";
import { navigationContent } from "../lib/navigation-mapping";
import { studioPath } from "../lib/content-validation";
import { textField } from "./content-fields";
const menuFields = ([name, items]: [string, typeof navigationDefaults.header]) => {
  const footerMenu = name.startsWith('footer') || name === 'legalLinks';
  return defineField({ name, title: name === "header" ? "Header links" : name === "treatments" ? "Treatments dropdown" : name === "footerServices" ? "Footer treatment links" : name === 'legalLinks' ? 'Legal links (optional)' : "Footer quick links", type: "array",
    description: name === 'legalLinks' ? 'Optional: up to four links beside the copyright. Use an existing page or a full external policy URL. Leave empty to hide them.' : name === 'footerServices' ? 'Add 1–40 treatment links. Use the treatment page path, such as /services/dental-implants.' : footerMenu ? 'Add 1–40 links. Use an existing page or an external website. Drag to reorder.' : "Add a link, enter its name and page address, then publish. Drag links to change their order. Switch off Show this menu item to hide one.",
    of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "key", title: "Menu identity", type: "string", hidden: true, readOnly: true, options: { list: items.map(i => ({ title: i.label, value: i.key })) } }),
      { ...textField("label", "Menu label", true, false, { maxLength: 64, description: 'Required: the link name visitors will see, up to 64 characters.' }), ...(footerMenu ? { validation: undefined } : {}) },
      defineField({ name: "route", title: "Page address", type: "string", hidden: ({ parent }) => name === "header" && parent?.key === "treatments", description: name === 'footerServices' ? 'For example /services/dental-implants. This column links to treatment pages.' : 'For example /contact or https://example.com/privacy. The destination page must already exist.' }),
      ...(footerMenu ? [defineField({ name: 'opensInNewTab', title: 'Open in a new tab', type: 'boolean', description: 'Normally used for external websites. A saved Yes remains visible after changing the address so you can switch it off.', hidden: ({ parent }) => parent?.opensInNewTab !== true && (typeof parent?.route !== 'string' || !/^https?:\/\//.test(parent.route)) })] : []),
      defineField({ name: "visible", title: "Show this menu item", type: "boolean", initialValue: true }),
    ], preview: { select: { title: "label", subtitle: "route", visible: "visible" }, prepare: ({ title, subtitle, visible }) => ({ title, subtitle: visible === false ? `Hidden — ${subtitle ?? "dropdown"}` : subtitle ?? "Treatments dropdown" }) } })],
    // Footer requirements are reported once by the document validator, at keyed field paths.
    ...(footerMenu ? {} : { validation: (r: ArrayRule<unknown[]>) => r.required().min(1).max(name === "header" ? 8 : 40) }),
  });
};
export const navigation = defineType({ name: "navigation", title: "Navigation and footer", type: "document",
  initialValue: { ...navigationDefaults, ...Object.fromEntries((["header", "treatments", "footerServices", "footerQuick", "legalLinks"] as const).map(name => [name, navigationDefaults[name].map(item => ({ ...item, _type: "object", _key: item.key }))])) },
  fields: [...(["header", "treatments", "footerServices", "footerQuick", "legalLinks"] as const).map(name => menuFields([name, navigationDefaults[name]])), textField("allTreatmentsLabel", "All-treatments link label", true, false, { maxLength: 64 }), defineField({ name: "footer", title: "Footer presentation", type: "object", fields: Object.keys(navigationDefaults.footer).map(name => ({ ...textField(name, name === "intro" ? "Footer introduction" : name === 'copyright' ? 'Copyright (optional)' : name.replace(/([A-Z])/g, " $1"), name !== 'copyright', name === "intro", { maxLength: name === "intro" ? 600 : name === 'copyright' ? 160 : 64, description: name === 'copyright' ? 'Optional. Use {year} for the current year. Leave unset to keep the existing copyright.' : name === 'intro' ? 'Required: the short paragraph below the logo, up to 600 characters.' : 'Required: the heading visitors will see above this footer column, up to 64 characters.' }), validation: undefined })) })],
  validation: r => r.custom((value, context) => getPublishedId(context.document?._id ?? "") !== "navigation" ? "Use Navigation and footer in Structure." : (() => {
    const result = navigationContent.safeParse(value);
    return result.success || result.error.issues.filter((issue, index, issues) => !issues.slice(0, index).some(previous => JSON.stringify(previous.path) === JSON.stringify(issue.path))).map(issue => {
      const leaf = issue.path.at(-1), menu = issue.path[0];
      const message = issue.code === 'custom' ? issue.message
        : leaf === 'label' ? 'Enter the link name using 1–64 characters of plain text.'
        : leaf === 'route' ? 'Enter an existing page path or a full https:// website address.'
        : leaf === 'opensInNewTab' ? 'Choose whether this external link opens in a new tab.'
        : leaf === 'intro' ? 'Enter the footer introduction using 1–600 characters of plain text.'
        : leaf === 'copyright' ? 'Enter 1–160 characters, or clear this optional field. Use {year} for the year.'
        : ['servicesHeading', 'quickHeading', 'contactHeading'].includes(String(leaf)) ? 'Enter this column heading using 1–64 characters of plain text.'
        : issue.path.length === 1 && ['footerServices', 'footerQuick', 'legalLinks'].includes(String(menu)) ? menu === 'legalLinks' ? 'Keep no more than four legal links. Remove the extra links.' : 'Add between one and forty links to this column.'
        : leaf === 'footer' ? 'Fill in the footer headings and introduction.' : 'Complete this field before publishing.';
      return { message, path: studioPath(value, issue.path) };
    });
  })()), preview: { prepare: () => ({ title: "Navigation and footer" }) },
});
