/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['drive.google.com'],
	},
	compress: true,
}

module.exports = nextConfig
