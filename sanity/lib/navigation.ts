import "server-only";
import { cache } from "react";
import { defineQuery } from "next-sanity";
import { readPublishedContent } from "./content-reader";
import { resolveNavigation } from "./navigation-mapping";
import { getServices } from "./services";
export const navigationQuery = defineQuery(`*[_type == "navigation" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0...2]{_id,header[]{"key":coalesce(key,_key),label,route,visible},treatments[]{"key":coalesce(key,_key),label,route,visible},footerServices[]{"key":coalesce(key,_key),label,route,visible,opensInNewTab},footerQuick[]{"key":coalesce(key,_key),label,route,visible,opensInNewTab},legalLinks[]{"key":coalesce(key,_key),label,route,visible,opensInNewTab},allTreatmentsLabel,footer{servicesHeading,quickHeading,contactHeading,intro,copyright}}`);
export const getNavigation = cache(() => readPublishedContent(navigationQuery, {}, "navigation", resolveNavigation));

/** The editable menu plus any treatment created in the CMS, which joins the Treatments menu automatically. */
export const getNavigationWithTreatments = cache(async () => {
  const [navigation, catalog] = await Promise.all([getNavigation(), getServices()]);
  const listed = new Set(navigation.treatments.map((item) => item.route));
  const added = catalog.filter((service) => !listed.has(`/services/${service.slug}`))
    .map((service) => ({ key: service.slug, label: service.title, route: `/services/${service.slug}`, visible: true }));
  return added.length ? { ...navigation, treatments: [...navigation.treatments, ...added] } : navigation;
});
