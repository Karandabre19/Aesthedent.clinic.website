import { defineQuery } from "next-sanity";

// Validation reads published peers only; the current draft is supplied by Studio.
export const insightFeaturedQuery = defineQuery(`
  *[_type == "insight" && slug.current in $slugs && _id != $id
    && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0...7]{
    "slug":slug.current,featured
  }
`);

// Seven results reveal duplicate eligible records for the six existing URLs.
export const insightsQuery = defineQuery(`
  *[_type == "insight" && slug.current in $slugs
    && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0...7]{
    coverImage{alt,crop{top,bottom,left,right},hotspot{x,y,width,height},asset->{_id,url,mimeType,metadata{dimensions{width,height}}}},_id,"slug":slug.current,title,excerpt,metaTitle,metaDescription,listingTitle,listingExcerpt,modifiedAt,category,date,readTimeMinutes,featured,
    editorialStatus,authorKey,review,sources[]{title,url},
    seo{focusKeyword,secondaryKeywords,ogTitle,ogDescription,twitterTitle,twitterDescription,canonicalRoute,index,follow,visibilityReason,structuredData,socialImage{alt,crop,hotspot,asset->{_id,url,mimeType,metadata{dimensions{width,height}}}}},
    body[]{_type,_key,"style":coalesce(style,"normal"),listItem,level,
      "markDefs":coalesce(markDefs[]{_type,_key,href},[]),children[]{_type,_key,text,"marks":coalesce(marks,[])}}
  }
`);
