import AreaClient from './AreaClient';
import JsonLd from '@/components/seo/JsonLd';
import { buildClinicSchema, buildBreadcrumbSchema, SITE_URL } from '@/lib/schema';

const PAGE_PATH = '/dental-clinic-in-kothrud';

// PHASE 4F - the only net-new URL in this project.
//
// It replaces nothing, renames nothing and redirects nothing. Every existing
// route, including all eight service slugs, is untouched.
//
// SELF-CANONICAL, and this matters more here than anywhere else on the site.
// A location page that canonicals to the homepage is asking Google not to index
// it, which would make the whole exercise pointless. It points at itself.
//
// INTENT SPLIT - this page must not become a sixth cannibalisation a part after
// we removed five (audit/01-content-spine.md §1.2):
//   /                          → "dentist in kothrud"          - brand entry
//   /dental-clinic-in-kothrud  → "dental clinic in kothrud"    - location & access (this)
//   /about                     → "dentist for nervous patients" - the wedge, retitled in 4F
//   /contact                   → booking, phone, map, form      - transactional
// The exact-match URL is why this page takes "dental clinic in kothrud" rather
// than /about, which held it after Part C.
export const metadata = {
  title: 'Dental Clinic in Kothrud, Pune',
  description:
    'Aesthedent is a dental clinic on Paud Road in Kothrud, Pune, a short drive from Karve Nagar, Erandwane and Deccan. Open six days including weekends.',
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    title: 'Dental Clinic in Kothrud, Pune | Aesthedent',
    description:
      'Where we are, who we see, and how to reach us - a specialist prosthodontist-led dental clinic in Kothrud.',
    url: `${SITE_URL}${PAGE_PATH}`,
    type: 'website',
    locale: 'en_IN',
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        schema={[
          // Same @id as every other page - one clinic, one entity. See the note
          // on buildClinicSchema in lib/schema.js.
          buildClinicSchema({ mainEntityOfPage: `${SITE_URL}${PAGE_PATH}` }),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Dental Clinic in Kothrud', path: PAGE_PATH },
          ]),
        ]}
      />
      <AreaClient />
    </>
  );
}
