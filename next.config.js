/** @type {import('next').NextConfig} */
const nextConfig = {
  ReactStrictMode: false,
};

module.exports = nextConfig;
module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
};
