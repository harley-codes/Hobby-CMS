import '@/styles/global.scss'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { ConfirmationModal } from '@/components/ConfirmationModal'
import LoadingModal from '@/components/LoadingModal'
import { MessageAlertModal } from '@/components/MessageAlertModal'
import { MetaDataEditorModal } from '@/components/MetaDataEditorModal'
import { NextAuthProvider } from '@/modules/auth/NextAuthProvider'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
	weight: ['300'],
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
	robots: 'noindex, nofollow'
}

export default async function RootLayout(props: ChildProps)
{
	const session = await getServerSession()

	const { children } = props

	return (
		<html lang="en" className={roboto.className}>
			<body className={roboto.className}>
				<NextAuthProvider session={session}>
					{children}
					<section>
						<ConfirmationModal />
						<LoadingModal />
						<MessageAlertModal />
						<MetaDataEditorModal />
					</section>
				</NextAuthProvider>
			</body>
		</html>
	)
}
