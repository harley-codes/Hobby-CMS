import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
	eslint: {
		dirs: ['./'],
	},
	sassOptions: {
		includePaths: [path.join(__dirname, 'src', 'styles')],
	},
}

export default nextConfig
