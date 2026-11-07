/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "https", hostname: "books.google.com" },
      { protocol: "https", hostname: "copertine.hoepli.it" },
      { protocol: "https", hostname: "www.feltrinellieditore.it" },
    ],
  },
};

module.exports = nextConfig;
