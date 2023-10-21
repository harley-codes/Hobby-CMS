import type { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export const nextAuthOptions: NextAuthOptions = {
	providers: [
		GithubProvider({
			clientId: process.env.NEXTAUTH_PROVIDER_GITHUB_ID,
			clientSecret: process.env.NEXTAUTH_PROVIDER_GITHUB_SECRET,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt',
	},
	jwt: {
		secret: process.env.NEXTAUTH_SECRET,
	},
	callbacks: {
		async signIn({ user, account, profile, email, credentials })
		{
			const users = process.env.NEXTAUTH_PROVIDER_GITHUB_ADMIN_USER_IDs.split('|')
			return users.includes(user.id)
		},
	},
	debug: false,
}
