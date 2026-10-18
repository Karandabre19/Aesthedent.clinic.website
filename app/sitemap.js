import { insights } from '@/lib/insights';
import { getServices } from '@/sanity/lib/services';
import { getInsightOverrides } from '@/sanity/lib/insights';
import { applyInsightOverrides } from '@/sanity/lib/insight-overrides';
import { getSeoState } from '@/sanity/lib/seo';
import { resolveSeoMetadata } from '@/sanity/lib/seo-mapping';

const SITE_URL = 'https://www.aesthedentpune.com';

// Only indexable, canonical URLs belong here. Keep this list aligned with the
// routes that emit a canonical tag; never add API, 404, redirect, filter, or
// preview URLs to a sitemap.
const staticPaths = [
  '/',
  '/about',
  '/aesthedent-experience',
  '/contact',
  '/dental-clinic-in-kothrud',
  '/doctor',
  '/services',
  '/insights',
];

function absoluteUrl(path) {
  return new URL(path, SITE_URL).toString();
}

function publishedDate(date) {
  const timestamp = Date.parse(date);
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp);
}

export default async function sitemap() {
  const staticRoutes = staticPaths.map((path) => ({ url: absoluteUrl(path) }));

  // Includes treatments created in the CMS; falls back to the code list if the CMS is unavailable.
  const serviceRoutes = (await getServices(true)).map(({ slug }) => ({
    url: absoluteUrl(`/services/${slug}`),
  }));

  const articles = applyInsightOverrides(insights, await getInsightOverrides(true));
  const insightRoutes = articles.map(({ slug, date, publishedDate: cmsDate, modifiedAt }) => ({
    url: absoluteUrl(`/insights/${slug}`),
    // The article publication date is the only verified page-change date in the
    // source data. Omit lastModified for other pages rather than inventing one.
    lastModified: publishedDate(modifiedAt ?? (cmsDate ? `${cmsDate}T00:00:00.000Z` : date)),
  }));

  const state = await getSeoState(true);
  return [...staticRoutes, ...serviceRoutes, ...insightRoutes].filter(entry => {
    const route = new URL(entry.url).pathname;
    return resolveSeoMetadata(route, {}, state.defaults, state.pages[route], state.pages).indexable;
  });
}
