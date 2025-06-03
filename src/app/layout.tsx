import '@/styles/global.scss'

import { materialTheme } from '@/app/theme'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { InputModal } from '@/components/InputModal'
import { LoadingModal } from '@/components/LoadingModal'
import { MessageAlertModal } from '@/components/MessageAlertModal'
import { MetaDataEditorModal } from '@/components/MetaDataEditorModal'
import { NextAuthProvider } from '@/modules/auth/NextAuthProvider'
import { robotoFont } from '@/modules/fonts/robotoFont'
import { CssBaseline } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'



export const metadata: Metadata = {
	title: 'Hobby CMS',
	description: 'Headless CMS for anything, such as a blog or portfolio.',
	robots: 'noindex, nofollow'
}

export default async function RootLayout(props: ChildProps)
{
	const session = await getServerSession()

	const { children } = props

	return (
		<html lang="en" className={robotoFont.className}>
			<body>
				<AppRouterCacheProvider options={{ enableCssLayer: true }}>
					<ThemeProvider theme={materialTheme}>
						<CssBaseline />
						<NextAuthProvider session={session}>
							{children}
							<section>
								<ConfirmationModal />
								<LoadingModal />
								<MessageAlertModal />
								<MetaDataEditorModal />
								<InputModal />
							</section>
						</NextAuthProvider>
					</ThemeProvider>
				</AppRouterCacheProvider>

			</body>
		</html>
	)
}
