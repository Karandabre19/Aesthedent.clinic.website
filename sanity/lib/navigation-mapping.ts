import { z } from "zod";
import { editorialText } from "./content-validation";
import { navigationDefaults, publicRoutes } from "./navigation-data";
export const isNavigationRoute = (route: string) => publicRoutes.includes(route) || /^https?:\/\//.test(route) && z.string().url().safeParse(route).success || /^\/(services|insights)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(route);
const menuItem = z.object({ key: z.string().optional(), _key: z.string().optional(), label: editorialText.max(64), route: z.string().nullish(), visible: z.boolean().default(true), opensInNewTab: z.boolean().nullish() }).transform(item => ({ key: item.key || item._key || item.route || "", label: item.label, route: item.route ?? null, visible: item.visible, ...(item.opensInNewTab == null ? {} : { opensInNewTab: item.opensInNewTab }) }));
const menu = (defaults: typeof navigationDefaults.header, treatments = false) => z.array(menuItem).min(defaults === navigationDefaults.legalLinks ? 0 : 1).max(defaults === navigationDefaults.header ? 8 : defaults === navigationDefaults.legalLinks ? 4 : 40).superRefine((items, context) => {
  const seen = new Set<string>();
  if (defaults !== navigationDefaults.legalLinks && !items.some(i => i.visible)) context.addIssue({ code: "custom", message: "Show at least one link in this menu." });
  for (const [index, i] of items.entries()) {
    const group = defaults === navigationDefaults.header && i.key === "treatments";
    if (!i.key || seen.has(i.key)) context.addIssue({ code: "custom", path: [index, "label"], message: "Remove this duplicate menu item and add a new link." });
    seen.add(i.key);
    if (group ? i.route !== null : !i.route || !isNavigationRoute(i.route) || treatments && !i.route.startsWith("/services/")) context.addIssue({ code: "custom", path: [index, "route"], message: group ? "Treatments opens the dropdown. Leave its page address empty." : treatments ? "Enter a treatment page path, such as /services/dental-implants." : "Enter an existing page path, such as /contact, or a full https:// website address. Remove links whose pages are not ready." });
    if (i.visible && i.route && items.slice(0, index).some(previous => previous.visible && previous.route === i.route)) context.addIssue({ code: "custom", path: [index, "route"], message: "This page is already in this menu. Remove the duplicate link or hide it." });
  }
});
export const navigationContent = z.object({
  header: menu(navigationDefaults.header), treatments: menu(navigationDefaults.treatments, true), footerServices: menu(navigationDefaults.footerServices, true), footerQuick: menu(navigationDefaults.footerQuick),
  legalLinks: menu(navigationDefaults.legalLinks).nullish().transform(value => value ?? []),
  allTreatmentsLabel: editorialText.max(64), footer: z.object({ servicesHeading: editorialText.max(64), quickHeading: editorialText.max(64), contactHeading: editorialText.max(64), intro: editorialText.max(600), copyright: z.preprocess(value => value == null || typeof value === 'string' && !value.trim() ? undefined : value, editorialText.max(160).refine(value => !/[{}]/.test(value.replaceAll('{year}', '')), 'Use {year} for the year. Remove other text inside curly brackets.').optional()).transform(value => value ?? navigationDefaults.footer.copyright) }),
});
export type NavigationContent = z.infer<typeof navigationContent>;
export function resolveNavigation(input: unknown): { value: NavigationContent; status: string } {
  const parsed = z.array(navigationContent.extend({ _id: z.literal("navigation") })).max(1).safeParse(input);
  if (!parsed.success) {
    const documents = z.array(z.object({ _id: z.literal('navigation') }).passthrough()).length(1).safeParse(input);
    const document = documents.success ? documents.data[0] : undefined;
    const core = navigationContent.omit({ footerServices: true, footerQuick: true, legalLinks: true, footer: true }).safeParse(document);
    if (!core.success || !document) return { value: navigationDefaults, status: "invalid" };
    // A malformed footer item must not discard unrelated, valid published menus.
    const safeMenu = (name: 'footerServices' | 'footerQuick' | 'legalLinks') => {
      const raw = document[name], limit = name === 'legalLinks' ? 4 : 40;
      if (!Array.isArray(raw) || raw.length > limit) return name === 'legalLinks' ? [] : navigationDefaults[name];
      const items = raw.flatMap(value => { const result = menuItem.safeParse(value); return result.success ? [result.data] : []; });
      const safe: typeof navigationDefaults.footerQuick = [];
      for (const item of items) {
        if (!item.route || !isNavigationRoute(item.route) || name === 'footerServices' && !item.route.startsWith('/services/') || safe.some(previous => previous.key === item.key || previous.visible && item.visible && previous.route === item.route)) continue;
        safe.push(item);
      }
      return safe.length && (name === 'legalLinks' || safe.some(item => item.visible)) ? safe : name === 'legalLinks' ? [] : navigationDefaults[name];
    };
    const footer = navigationContent.shape.footer.safeParse(document.footer);
    return { value: { ...core.data, footerServices: safeMenu('footerServices'), footerQuick: safeMenu('footerQuick'), legalLinks: safeMenu('legalLinks'), footer: footer.success ? footer.data : navigationDefaults.footer }, status: 'invalid' };
  }
  const value = parsed.data[0] ? navigationContent.parse(parsed.data[0]) : navigationDefaults;
  return { value, status: parsed.data.length ? "sanity" : "missing" };
}
