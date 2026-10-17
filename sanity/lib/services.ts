import "server-only";
import { cache } from "react";
import { defineQuery } from "next-sanity";
import { resolveServices } from "./service-mapping";
import { readPublishedContent } from "./content-reader";

export const servicesQuery = defineQuery(`
  *[_type == "service" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0...9]{
    coverImage{alt,crop{top,bottom,left,right},hotspot{x,y,width,height},asset->{_id,url,mimeType,metadata{dimensions{width,height}}}},_id,"slug":slug.current,title,shortDesc,problem,solution,benefit,hero{headline,promise},aboutHeading,fullDescription,
    aboutList{heading,items},benefits,whyAesthedent[]{title,desc},process[]{step,title,desc},faqs[]{q,a}
  }
`);
export const getServices = cache(() => readPublishedContent(servicesQuery, {}, "services", resolveServices));
