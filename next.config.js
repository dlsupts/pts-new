const WindiCssWebpackPlugin = require('windicss-webpack-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack(config) {
    config.plugins.push(new WindiCssWebpackPlugin())
    return config
  },
}

module.exports = nextConfig
