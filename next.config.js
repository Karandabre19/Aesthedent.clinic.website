const nextConfig = {
  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '**',
      },
    ],
  },

  // ✅ Updated from experimental → stable
  serverExternalPackages: ['mongodb'],

  experimental: {
    optimizeCss: true, // Inlines critical CSS & defers the rest
  },

  // ✅ Enable Turbopack explicitly (clean signal)
  turbopack: {},

  // ⚠️ Keep only if really needed
  onDemandEntries: {
    maxInactiveAge: 10000,
    pagesBufferLength: 2,
  },

  // Allow dev resource access from preview origins
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '*.vusercontent.net',
  ],

  // Phase 4F. Established deliberately, and deliberately EMPTY.
  //
  // This project has never had a redirect map, which is exactly why the hard
  // rule is that no existing URL may be renamed: a changed slug would 404 with
  // nothing to catch it, and three indexed pages is not a budget for that.
  //
  // /dental-clinic-in-kothrud is a NET-NEW path, so it needs no redirect - there
  // is no old URL to send anywhere. The array exists so the pattern is in place
  // before the next area page, not because this one uses it.
  //
  // If you ever DO retire an area page, add it here in the same commit that
  // removes it:
  //   { source: '/old-path', destination: '/new-path', permanent: true },
  async redirects() {
    return [];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" }, // safer than ALLOWALL
          { key: "Content-Security-Policy", value: "frame-ancestors 'self';" },
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.CORS_ORIGINS || "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
