/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer, dev }) => {
    // This will print the webpack configuration
    console.log("Webpack config:", JSON.stringify(config, null, 2))

    // Log environment variables (be careful not to log sensitive information)
    console.log("NODE_ENV:", process.env.NODE_ENV)
    console.log("VERCEL_ENV:", process.env.VERCEL_ENV)

    // Add more logging as needed

    return config
  },
}

module.exports = nextConfig

