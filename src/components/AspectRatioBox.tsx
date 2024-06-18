'use client'

import { Box, SxProps } from '@mui/material'

type Props = {
	children: JSX.Element
	aspectRatio: string
	borderRadius?: string
	backgroundColor?: string
	background?: string
	blurBackground?: boolean
}

export function AspectRatioBox(props: Props)
{
	const { children, aspectRatio, borderRadius, background, blurBackground = true } = props

	const mainStyle: SxProps = {
		display: 'flex',
		justifyContent: 'center',
		aspectRatio: aspectRatio,
		borderRadius: borderRadius,
		position: 'relative',
		zIndex: 1,
		overflow: 'hidden'
	}

	const backgroundStyle: SxProps = {
		zIndex: 0,
		width: '100%',
		height: '100%',
		background: background,
		filter: blurBackground ? 'blur(2px)' : undefined,
		position: 'absolute',
		transform: 'scale(1.1)',
	}

	const childBoxStyle: SxProps = {
		zIndex: 1,
		width: '100%',
		height: '100%',
	}

	return (
		<Box sx={mainStyle}>
			<Box sx={backgroundStyle} />
			<Box sx={childBoxStyle}>
				{children}
			</Box>
		</Box>
	)
}
