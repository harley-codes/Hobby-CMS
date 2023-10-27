'use client'

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

type Props = ChildProps & {
	session: Session | null
}

export const NextAuthProvider = (props: Props) =>
{
	const { session, children } = props

	return (
		<SessionProvider session={session}>{children}</SessionProvider>
	)
}
