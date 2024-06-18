'use client'

import { FileTypeIcon } from '@/app/dashboard/files/_components/FileTypeIcon'
import { ImageBox } from '@/components/ImageBox'
import { DataFileSearchItem } from '@/modules/database/responseTypes'
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'

type Props = {
	data: DataFileSearchItem
	onClick: () => void
}

export function FileListItem(props: Props)
{
	const { data, onClick } = props

	return (
		<Card>
			<CardActionArea onClick={onClick}>
				<CardMedia sx={{ width: '100%' }}>
					{data.hasThumbnail && (
						<ImageBox
							aspectRatio='3/2'
							src={`/api/public/files/thumbnail/${data.id}`}
							alt={data.name}
							backgroundImageFill={true}
						/>

					)}

					{!data.hasThumbnail && (
						<Box
							sx={{
								display: 'flex', height: '100%',
								justifyContent: 'center', alignItems: 'center',
								fontSize: '2em',
								aspectRatio: '3/2',
							}}>
							<FileTypeIcon extension={data.extension} />
						</Box>
					)}
				</CardMedia>

				<CardContent>
					<Typography
						component="pre"
						variant="caption"
						color="text.secondary"
						whiteSpace="nowrap"
						overflow="hidden"
						title={data.name}
					>
						{data.name}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}
