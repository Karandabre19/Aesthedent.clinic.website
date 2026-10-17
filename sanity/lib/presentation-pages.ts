import "server-only";
import { cache } from "react";
import { defineQuery } from "next-sanity";
import { readPublishedContent } from "./content-reader";
import { resolvePresentationPage } from "./presentation-mapping";
import type { PresentationPageName } from "./presentation-definitions";

export const presentationPageQuery = defineQuery(`*[_type == $name && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0...2]{_id,_type,hero,labels,approach,closing,support,values,actions,visit,appointment,area,why,treatments,detail}`);
export const getPresentationPage = cache((name: PresentationPageName) => readPublishedContent(presentationPageQuery, { name }, name, input => resolvePresentationPage(input, name)));
