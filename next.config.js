/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' })

const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['lh3.googleusercontent.com'],
	},
	compress: true,
}

module.exports = withAnalyzer(nextConfig)
