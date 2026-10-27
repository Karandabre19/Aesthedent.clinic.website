import "server-only";
import { draftMode } from "next/headers";
import { cache } from "react";
import { defineQuery } from "next-sanity";
import { siteMetadata } from "../../lib/site-metadata";
import { readPublishedContent } from "./content-reader";
import { canonicalProblem, maximumSeoDocuments, resolveSeoInventory, resolveSeoMetadata, type SeoControls } from "./seo-mapping";
import { getInsightOverrides } from "./insights";
import type { Metadata } from "next";

export const seoQuery = defineQuery(`*[_type in ["homePage","aboutPage","experiencePage","servicesPage","teamPage","insightsPage","contactPage","localLandingPage","service","seoSettings"] && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0...${maximumSeoDocuments + 1}]{_id,_type,"slug":slug.current,seo{backlinks[]{_key,url},focusKeyword,secondaryKeywords,metaTitle,metaDescription,ogTitle,ogDescription,twitterTitle,twitterDescription,canonicalRoute,index,follow,visibilityReason,structuredData,faqStructuredData,socialImage{alt,crop,hotspot,asset->{_id,url,mimeType,metadata{dimensions{width,height}}}}},defaults{metaTitle,metaDescription,ogTitle,ogDescription,twitterTitle,twitterDescription,socialImage{alt,crop,hotspot,asset->{_id,url,mimeType,metadata{dimensions{width,height}}}}}}`);
export const getSeoState = cache(async (publishedOnly = false) => {
  const [state, articles] = await Promise.all([readPublishedContent(seoQuery, {}, "seo", resolveSeoInventory, publishedOnly), getInsightOverrides(publishedOnly)]);
  const pages: Record<string, SeoControls> = { ...state.pages };
  for (const article of articles) if (article.seo) pages[`/insights/${article.slug}`] = article.seo;
  return { defaults: state.defaults, pages: Object.fromEntries(Object.entries(pages).filter(([route, seo]) => !canonicalProblem(route, seo, pages))) };
});
export async function getPageSeo(route: string, base: Metadata) {
  const state = await getSeoState();
  const resolved = resolveSeoMetadata(route, base, state.defaults, state.pages[route], state.pages);
  if ((await draftMode()).isEnabled) resolved.metadata.robots = { index: false, follow: false };
  return { ...resolved, backlinks: state.pages[route]?.backlinks ?? [] };
}
export async function getRootSeoMetadata(): Promise<Metadata> {
  const { defaults } = await getSeoState();
  const resolved = resolveSeoMetadata("/", siteMetadata, defaults, defaults);
  return { ...siteMetadata, title: { default: defaults.metaTitle ?? (siteMetadata.title && typeof siteMetadata.title === "object" && "default" in siteMetadata.title ? siteMetadata.title.default : "Aesthedent"), template: "%s | Aesthedent" },
    description: defaults.metaDescription ?? siteMetadata.description, openGraph: resolved.metadata.openGraph, twitter: resolved.metadata.twitter };
}
