/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👈 ADD THIS LINE TO DISABLE STRICT MODE
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: "https", // Specify the protocol (https)
        hostname: "lh3.googleusercontent.com", // Specify the hostname
        // pathname: "/**", // Wildcard for any path
      },
    ],
  },
};

export default nextConfig