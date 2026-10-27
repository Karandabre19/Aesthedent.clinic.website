import { SITE_URL } from "../../lib/schema.js";
import { imageUrl } from "./image-url";
import type { CmsImage } from "./image";

type ArticleSeoSource = { slug: string; title: string; excerpt: string; metaTitle?: string; metaDescription?: string; image?: string; coverImage?: CmsImage; date?: string; publishedDate?: string; modifiedAt?: string; author?: { name: string; url: string }; sources?: { title: string; url: string }[] };
export function insightSeo(article: ArticleSeoSource) {
  const canonical = `${SITE_URL}/insights/${article.slug}`, description = article.metaDescription ?? article.excerpt;
  const image = article.coverImage ? imageUrl(article.coverImage, 1200, 630) : article.image || undefined;
  const alt = article.coverImage?.alt ?? article.title;
  const knownDate = article.publishedDate ?? (article.date && !Number.isNaN(Date.parse(`${article.date} UTC`)) ? new Date(`${article.date} UTC`).toISOString().slice(0, 10) : undefined);
  const author = article.author ? { "@type": "Person", name: article.author.name, url: new URL(article.author.url, SITE_URL).href } : undefined;
  return {
    metadata: {
      title: article.metaTitle ?? article.title, description, alternates: { canonical: `/insights/${article.slug}` },
      openGraph: { title: article.title, description, url: canonical, type: "article" as const, siteName: "Aesthedent Dental Clinic", locale: "en_IN", ...(image ? { images: [{ url: image, alt }] } : {}), ...(knownDate ? { publishedTime: knownDate } : {}), ...(article.modifiedAt ? { modifiedTime: article.modifiedAt } : {}), ...(author ? { authors: [author.url] } : {}) },
      twitter: { card: "summary_large_image" as const, title: article.title, description, ...(image ? { images: [{ url: image, alt }] } : {}) },
    },
    structuredData: { "@context": "https://schema.org", "@type": "BlogPosting", "@id": `${canonical}#article`, url: canonical, mainEntityOfPage: canonical, headline: article.title, description, ...(image ? { image: [image] } : {}), publisher: { "@id": `${SITE_URL}/#organization` },
      ...(knownDate ? { datePublished: knownDate } : {}), ...(article.modifiedAt ? { dateModified: article.modifiedAt } : {}), ...(author ? { author } : {}), ...(article.sources?.length ? { citation: article.sources.map(source => source.url) } : {}) },
  };
}
