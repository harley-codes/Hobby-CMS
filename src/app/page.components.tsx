'use client'

import { GitHub as GitHubIcon, Login as LoginIcon } from '@mui/icons-material'
import { Box, Button, Stack, Typography } from '@mui/material'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function HeaderContent()
{
	const { data: session, status } = useSession()

	if (status === 'authenticated' && session.user?.image)
	{
		return (
			<Stack direction="row" justifyContent="center" mb={2}>
				<Box width={{ sm: '120px', xs: '75px' }} height={{ sm: '120px', xs: '75px' }}>
					<picture>
						<img src={session.user.image ?? ''} alt="" style={{ borderRadius: '50%', width: '100%', height: '100%' }} />
					</picture>
				</Box>
			</Stack>
		)
	}

	if (status === 'authenticated' && !session.user?.image)
	{
		return (
			<Typography variant="h6" mb={2}>
				Welcome {session.user?.name ?? session.user?.email ?? 'user'}!
			</Typography>
		)
	}

	return (
		<Typography variant="h6" mb={2}>
			Headless CMS for anything, such as a blog or portfolio.
		</Typography>
	)
}

export function CallToAction()
{
	const { status } = useSession()
	const router = useRouter()

	return (
		<Stack direction="column" gap={2}>
			{status === 'authenticated' && (
				<Stack direction="row" spacing={2} useFlexGap flexWrap={{ xs: 'wrap', sm: 'nowrap' }}>
					<Button
						onClick={() => router.push('/dashboard')}
						variant="contained" startIcon={<LoginIcon />}
						color="warning"
						fullWidth
					>
						Open Dashboard
					</Button>
					<Button
						onClick={() => signOut()}
						variant="outlined" startIcon={<LoginIcon />}
						fullWidth
						sx={{
							color: 'white',
							borderColor: 'white',
							':hover': {
								color: 'warning.light',
								borderColor: 'warning.light'
							}
						}}>
						Log out
					</Button>
				</Stack>
			)}
			{status === 'unauthenticated' && (
				<Button
					onClick={() => signIn('github')}
					variant="outlined" startIcon={<LoginIcon />}
					sx={{
						color: 'white',
						borderColor: 'white',
						':hover': {
							color: 'warning.light',
							borderColor: 'warning.light'
						}
					}}>
					Log into Dashboard
				</Button>
			)}
			<Box>
				<Button
					href='https://github.com/harley-codes/Hobby-CMS'
					target='_blank'
					startIcon={<GitHubIcon />}
					variant="contained"
					sx={{
						color: 'white',
						borderColor: 'white',
						':hover': {
							color: 'warning.light',
							borderColor: 'warning.light'
						}
					}} fullWidth>
					View Project
				</Button>
			</Box>
		</Stack>
	)
}
