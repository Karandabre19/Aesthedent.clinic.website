import 'server-only'
import { cache } from 'react'
import { defineQuery } from 'next-sanity'
import { readPublishedContent } from './content-reader'
import { resolveAvailability } from './availability-mapping'

export const availabilityQuery = defineQuery(`*[_type == "clinicAvailability" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0...2]{_id,timezone,weeklyHours[]{day,closed,open,close},closures[]{date,reason},confirmationNote,confirmedAt,confirmedSnapshot}`)
// Operational hours never enter draft preview or public caches from an unpublished document.
export const getClinicAvailability = cache(() => readPublishedContent(availabilityQuery, {}, 'clinicAvailability', resolveAvailability, true))
