import "server-only";
import { cache } from "react";
import { defineQuery } from "next-sanity";
import { readPublishedContent } from "./content-reader";
import { resolveNavigation } from "./navigation-mapping";
export const navigationQuery = defineQuery(`*[_type == "navigation" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0...2]{_id,header[]{key,label,route,visible},treatments[]{key,label,route,visible},footerServices[]{key,label,route,visible},footerQuick[]{key,label,route,visible},allTreatmentsLabel,footer{servicesHeading,quickHeading,contactHeading,intro}}`);
export const getNavigation = cache(() => readPublishedContent(navigationQuery, {}, "navigation", resolveNavigation));
