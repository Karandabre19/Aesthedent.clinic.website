import { services } from '@/lib/services';
import { insights } from '@/lib/insights';

export default function sitemap() {
  const baseUrl = 'https://www.aesthedentpune.com';

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/aesthedent-experience',
    '/about',
    '/contact',
    '/doctor',
    '/services',
    '/insights',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Dynamic Services
  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // 3. Dynamic Insights
  const insightRoutes = insights.map((insight) => ({
    url: `${baseUrl}/insights/${insight.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...insightRoutes];
}
