const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for npm workspace deps (cv-data) on Vercel
  outputFileTracingRoot: path.join(__dirname, '../../')
};

module.exports = nextConfig;
