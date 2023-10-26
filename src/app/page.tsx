import styles from '@/app/page.module.scss'

import { CallToAction, HeaderContent } from '@/app/page.components'
import { Container, Stack, Typography } from '@mui/material'
import { Lemon } from 'next/font/google'

const lemonFont = Lemon({
	weight: ['400'],
	subsets: ['latin'],
	display: 'swap',
	fallback: ['Helvetica', 'Arial', 'sans-serif'],
})

export default function LandingPage()
{
	return (
		<main className={styles.main}>
			<Container maxWidth="md" className={styles.contentWrapper}>
				<Stack className={styles.content} padding={3} gap={2}>
					<Typography
						sx={{
							typography: { sm: 'h2', xs: 'h4' },
							textShadow: '2px 2px rgba(0,0,0,0.4)'
						}}
						mb={2} className={lemonFont.className}>
						Hobby CMS
					</Typography>
					<HeaderContent />
					<CallToAction />
				</Stack>
			</Container>
		</main>
	)
}
