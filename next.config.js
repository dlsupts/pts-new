/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['drive.google.com'],
	},
	compress: true,
	// swcMinify: true,
}

module.exports = nextConfig
