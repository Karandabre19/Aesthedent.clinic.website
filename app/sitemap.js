import { insights } from '@/lib/insights';
import { services } from '@/lib/services';

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

export default function sitemap() {
  const staticRoutes = staticPaths.map((path) => ({ url: absoluteUrl(path) }));

  const serviceRoutes = services.map(({ slug }) => ({
    url: absoluteUrl(`/services/${slug}`),
  }));

  const insightRoutes = insights.map(({ slug, date }) => ({
    url: absoluteUrl(`/insights/${slug}`),
    // The article publication date is the only verified page-change date in the
    // source data. Omit lastModified for other pages rather than inventing one.
    lastModified: publishedDate(date),
  }));

  return [...staticRoutes, ...serviceRoutes, ...insightRoutes];
}
