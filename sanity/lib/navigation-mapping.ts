import { z } from "zod";
import { editorialText } from "./content-validation";
import { navigationDefaults, publicRoutes } from "./navigation-data";
const menuItem = z.object({ key: z.string(), label: editorialText.max(64), route: z.string().nullable(), visible: z.boolean() });
const menu = (defaults: typeof navigationDefaults.header, treatments = false) => z.array(menuItem).length(defaults.length).superRefine((items, context) => {
  if (new Set(items.map(i => i.key)).size !== defaults.length || items.some(i => !defaults.some(d => d.key === i.key))) context.addIssue({ code: "custom", message: "Keep every existing item identity exactly once; use visibility to hide an item." });
  if (!items.some(i => i.visible)) context.addIssue({ code: "custom", message: "Keep at least one visible item in this existing menu." });
  for (const [index, i] of items.entries()) {
    const group = defaults === navigationDefaults.header && i.key === "treatments";
    if (group ? i.route !== null : !i.route || !publicRoutes.includes(i.route) || treatments && !i.route.startsWith("/services/")) context.addIssue({ code: "custom", path: [index, "route"], message: group ? "The existing Treatments dropdown has no destination of its own." : "Select a valid existing destination for this menu." });
  }
  const visible = items.filter(i => i.visible && i.route).map(i => i.route);
  if (new Set(visible).size !== visible.length) context.addIssue({ code: "custom", message: "Use each visible destination once within a menu." });
});
export const navigationContent = z.object({
  header: menu(navigationDefaults.header), treatments: menu(navigationDefaults.treatments, true), footerServices: menu(navigationDefaults.footerServices, true), footerQuick: menu(navigationDefaults.footerQuick),
  allTreatmentsLabel: editorialText.max(64), footer: z.object({ servicesHeading: editorialText.max(64), quickHeading: editorialText.max(64), contactHeading: editorialText.max(64), intro: editorialText.max(600) }),
});
export type NavigationContent = z.infer<typeof navigationContent>;
export function resolveNavigation(input: unknown): { value: NavigationContent; status: string } {
  const parsed = z.array(navigationContent.extend({ _id: z.literal("navigation") })).max(1).safeParse(input);
  if (!parsed.success) return { value: navigationDefaults, status: "invalid" };
  const value = parsed.data[0] ? navigationContent.parse(parsed.data[0]) : navigationDefaults;
  return { value, status: parsed.data.length ? "sanity" : "missing" };
}
