const nextConfig = {
  output: 'standalone',

  images: {
    unoptimized: true,
  },

  // ✅ Updated from experimental → stable
  serverExternalPackages: ['mongodb'],

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
