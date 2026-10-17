import "server-only";
import { cache } from "react";
import { defineQuery } from "next-sanity";
import { readPublishedContent } from "./content-reader";
import { resolveTestimonials } from "./testimonial-mapping";

export const testimonialsQuery = defineQuery(`
  *[_type == "testimonial" && verifiedGoogleReview == true && publicationPermissionConfirmed == true
    && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0...7]{
    _id,slot,name,service,rating,text,sourceUrl,verifiedGoogleReview,publicationPermissionConfirmed
  }
`);
export const getPublishedTestimonials = cache(() => readPublishedContent(testimonialsQuery, {}, "testimonials", resolveTestimonials));
