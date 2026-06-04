// import type { NextConfig } from "next";
// @type {import('next').NextConfig}
// const nextConfig: NextConfig = {
//   /* config options here */
//   experimental: {
//     turbo: {
//       root: './tourist-app', // point to your actual app directory
//     },
//   }
// };

// export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;