/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
	eslint: {
		dirs: ['./'],
	},
	sassOptions: {
		includePaths: [path.join(__dirname, 'src', 'styles')],
	},
	experimental: {
		// TODO: Followup and make sure all security concerns are addressed.
		// https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations#convention
		serverActions: true,
	},
}

module.exports = nextConfig
