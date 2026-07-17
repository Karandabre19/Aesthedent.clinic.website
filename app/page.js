import HomeClient from './HomeClient';

// Server shell. Exists so this route can export metadata at all — the page body
// is a client component ('use client'), and client components silently export
// no metadata. Title/description come from the root layout defaults.
export const metadata = {
  alternates: {
    canonical: '/',
  },
};

export default function Page() {
  return <HomeClient />;
}
