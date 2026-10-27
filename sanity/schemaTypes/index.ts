
import { DocumentStatusInput } from "../studio/DocumentStatusInput";
import type { SchemaTypeDefinition } from "sanity";
import { insight } from "./insight";
import { service } from "./service";
import { doctor, homePage, aboutPage, experiencePage } from "./pages";
import { testimonial } from "./testimonial";
import { presentationPageTypes } from "./presentation-pages";
import { navigation } from "./navigation";
import { seoSettings, withPageSeo } from "./seo";
import { clinicAvailability } from './clinic-availability';
import { teamValues } from './team-values';

export const schemaTypes: SchemaTypeDefinition[] = [
  ...[insight, service, doctor, homePage, aboutPage, experiencePage, testimonial, ...presentationPageTypes, teamValues, navigation, seoSettings].map(withPageSeo).map(model => ({ ...model, components: { ...model.components, input: DocumentStatusInput } })),
  clinicAvailability,
];
