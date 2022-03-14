/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' })

const nextConfig = {
	reactStrictMode: false,
	images: {
		domains: ['drive.google.com'],
	},
	compress: true,
}

module.exports = withAnalyzer(nextConfig)
