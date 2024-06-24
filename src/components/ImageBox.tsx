'use client'

import { AspectRatioBox } from '@/components/AspectRatioBox'
import { Box, Skeleton } from '@mui/material'
import { CSSProperties, createRef, useEffect, useState } from 'react'

type ImageBoxProps = {
	src: string
	alt?: string
	aspectRatio?: string
	borderRadius?: string
	backgroundColor?: string
	backgroundImageFill?: boolean
}

export function ImageBox(props: ImageBoxProps)
{
	const { src, alt = '', aspectRatio, borderRadius, backgroundColor, backgroundImageFill } = props

	const imageFef = createRef<HTMLImageElement>()

	const [loading, setLoading] = useState(true)

	const imgStyle: CSSProperties = {
		objectFit: 'contain',
		height: '100%',
		width: '100%',
		display: loading ? 'none' : 'block',
	}

	const boxStyle: CSSProperties = {
		backgroundColor: backgroundColor,
		background: backgroundImageFill && !loading ? `url(${src}) center/cover` : undefined,
		borderRadius: borderRadius,
		width: '100%',
		height: '100%',
	}

	useEffect(() =>
	{
		if (imageFef.current?.complete) setLoading(false)
	}, [imageFef])

	if (aspectRatio)
	{
		return (
			<Box sx={boxStyle}>
				<AspectRatioBox aspectRatio={aspectRatio}>
					<>
						{loading && (
							<Skeleton variant="rectangular" width="100%" height="100%" sx={{ bgcolor: 'grey.200' }} />
						)}
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img ref={imageFef} onLoad={() => setLoading(false)} src={src} alt={alt} style={imgStyle} />
					</>
				</AspectRatioBox>
			</Box>
		)
	}

	return (
		<Box sx={boxStyle}>
			{loading && (
				<Skeleton variant="rectangular" width="100%" height="100%" sx={{ bgcolor: 'grey.200' }} />
			)}
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img ref={imageFef} onLoad={() => setLoading(false)} src={src} alt={alt} style={imgStyle} />
		</Box>
	)
}
