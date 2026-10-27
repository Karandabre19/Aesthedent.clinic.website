
export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[hsl(var(--color-bg-alt))] px-6 py-16 text-[hsl(var(--color-text))]">
      <section aria-labelledby="not-found-title" className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[hsl(var(--color-border))] bg-white px-6 py-14 text-center shadow-sm sm:px-14">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-2 bg-[hsl(var(--color-accent))]" />
        <a href="/" className="text-xl font-semibold tracking-wide text-[hsl(var(--color-primary))]">Aesthedent</a>
        <p className="my-6 text-8xl font-semibold leading-none tracking-tight text-[hsl(var(--color-primary))] sm:text-9xl">404</p>
        <h1 id="not-found-title" className="text-3xl font-semibold sm:text-4xl">Page Not Found</h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-[hsl(var(--color-text-muted))]">This page may have moved, or the address may be incorrect. Let’s get you back to a helpful place.</p>
        <nav aria-label="Find another page" className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/" className="rounded-full bg-[hsl(var(--color-primary))] px-7 py-3 font-semibold text-white transition-colors hover:bg-[hsl(var(--color-primary-dark))] focus-visible:outline focus-visible:outline-offset-4">Back to Home</a>
          <a href="/services" className="rounded-full border border-[hsl(var(--color-primary))] px-7 py-3 font-semibold text-[hsl(var(--color-primary))] transition-colors hover:bg-[hsl(var(--color-primary-light))] focus-visible:outline focus-visible:outline-offset-4">Explore Treatments</a>
        </nav>
        <p className="mt-8 text-sm text-[hsl(var(--color-text-muted))]">Need help? <a href="/contact" className="font-semibold text-[hsl(var(--color-primary))] underline underline-offset-4">Contact our team</a></p>
      </section>
    </main>
  );
}
