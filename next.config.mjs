/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    authInterrupts: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login", 
        permanent: false,
      },
    ];
  }
};

export default nextConfig;
