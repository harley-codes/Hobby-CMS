import { ImageBox } from '@/components/ImageBox'
import { Image as ImageIcon } from '@mui/icons-material'
import { Box, TextField } from '@mui/material'

export function FeaturedImageInput(props: { featuredImageURL?: string, forcedHeight?: number, onChange: (value: string) => void })
{
	const { featuredImageURL, forcedHeight = 217, onChange } = props

	return (
		<Box
			sx={{
				display: 'flex', flexDirection: 'column',
				width: '100%', height: forcedHeight - 1,
				border: 1, borderRadius: 1, borderColor: 'grey.400',
				overflow: 'hidden'
			}}
		>
			<TextField
				variant="filled" label="Featured Image URL" fullWidth size='small'
				sx={{
					'& .MuiFilledInput-root': {
						backgroundColor: 'grey.50'
					},
					'& .MuiFilledInput-input': {
						fontSize: '0.8rem'
					}
				}}
				value={featuredImageURL}
				onChange={(e) => onChange(e.currentTarget.value)}
			/>
			<Box flexGrow={1} display="flex" justifyContent="center" alignItems="center" color="grey.400" height="0%">
				{featuredImageURL && <ImageBox src={featuredImageURL} alt={featuredImageURL} backgroundImageFill />}
				{!featuredImageURL && <ImageIcon />}
			</Box>
		</Box>
	)
}
