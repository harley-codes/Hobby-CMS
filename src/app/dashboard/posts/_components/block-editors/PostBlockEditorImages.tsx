import { SortingControls } from '@/app/dashboard/posts/_components/SortingControls'
import { PostBlockEditorBaseProps } from '@/app/dashboard/posts/_components/block-editors/PostBlockEditorTypes'
import { ImageBox } from '@/components/ImageBox'
import { PostBlockListItem } from '@/modules/database/models'
import { Add as AddIcon } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, SxProps, TextField, Typography } from '@mui/material'
import { useState } from 'react'

type DataProps = PostBlockListItem & {
	images: {
		url: string
		caption?: string
		alt?: string
	}[]
	display: DisplayTypes
}

type DisplayTypes = 'single' | 'grid' | 'carousel'

export function PostBlockEditorImages({ data, onDataChange }: PostBlockEditorBaseProps)
{
	const { images, display: displayFormat } = data as DataProps

	const [displayImageList, setDisplayImageList] = useState(images.length == 0)
	const [newImageUrl, setNewImageUrl] = useState('')

	const imageBoxStyle: SxProps = {
		minHeight: '15em',
		maxHeight: '15em',
		minWidth: '18em',
		maxWidth: '18em',
		boxShadow: 2,
	}

	function displayChangeSelectHandler(newDisplay: DisplayTypes)
	{
		onDataChange({ ...data, display: constrainImageDisplay(newDisplay) })
	}

	function constrainImageDisplay(newDisplay: DisplayTypes): DisplayTypes
	{
		if (images.length < 2)
		{
			return 'single'
		}
		if (newDisplay === 'single' && images.length > 1)
		{
			return 'carousel'
		}
		return newDisplay
	}

	function addImageHandler(imageUrl: string)
	{
		if (imageUrl.trim() !== '')
		{
			const newImages = [...images, { url: imageUrl, caption: '', alt: '' }]
			onDataChange({ ...data, images: newImages, display: constrainImageDisplay(displayFormat) })
			setNewImageUrl('')
		}
	}

	function editImageAltHandler(index: number, altText: string)
	{
		const newImages = images.map((image, i) => i === index ? { ...image, alt: altText } : image)
		onDataChange({ ...data, images: newImages })
	}

	function editImageCaptionHandler(index: number, captionText: string)
	{
		const newImages = images.map((image, i) => i === index ? { ...image, caption: captionText } : image)
		onDataChange({ ...data, images: newImages })
	}

	function removeImageHandler(index: number)
	{
		const newImages = images.filter((_, i) => i !== index)
		onDataChange({ ...data, images: newImages, display: constrainImageDisplay(displayFormat) })
	}

	function onMoveImageHandler(imageIndex: number, position: 'top' | 'up' | 'down' | 'bottom')
	{
		if (!checkImageCanMove(imageIndex, position)) return

		const newImages = [...images]

		switch (position)
		{
			case 'top':
				newImages.splice(0, 0, newImages.splice(imageIndex, 1)[0])
				break
			case 'up':
				newImages.splice(imageIndex - 1, 0, newImages.splice(imageIndex, 1)[0])
				break
			case 'down':
				newImages.splice(imageIndex + 1, 0, newImages.splice(imageIndex, 1)[0])
				break
			case 'bottom':
				newImages.splice(newImages.length, 0, newImages.splice(imageIndex, 1)[0])
				break
		}
		onDataChange({ ...data, images: newImages })
	}

	function checkImageCanMove(imageIndex: number, position: 'top' | 'up' | 'down' | 'bottom'): boolean
	{
		if (position === 'top' || position === 'up') return imageIndex > 0
		if (position === 'down' || position === 'bottom') return imageIndex < images.length - 1
		return false
	}

	return (
		<Box>
			<Accordion disableGutters expanded={displayImageList} sx={{ boxShadow: 'none' }}>
				<AccordionSummary sx={{ padding: 0, boxShadow: 'none !important' }}>
					<Stack direction="row" spacing={2} flex={1}>
						<FormControl fullWidth size="small">
							<InputLabel>Image Display Format</InputLabel>
							<Select
								label="Image Display Format"
								value={displayFormat}
								onChange={(e) => displayChangeSelectHandler(e.target.value as DisplayTypes)}
							>
								<MenuItem value="single" disabled={images.length > 1}>Single Image</MenuItem>
								<MenuItem value="grid" disabled={images.length < 2}>Image Grid</MenuItem>
								<MenuItem value="carousel" disabled={images.length < 2}>Image Carousel</MenuItem>
							</Select>
						</FormControl>
						<Button
							variant={displayImageList ? 'contained' : 'outlined'}
							size='small'
							sx={{ width: '15em' }}
							onClick={() => setDisplayImageList(!displayImageList)}
						>
							{(displayImageList ? 'Hide' : 'Edit')} Image List
						</Button>
					</Stack>
				</AccordionSummary>
				<AccordionDetails sx={{ padding: 0 }}>
					<Stack spacing={1}>
						{images.map((image, imageIndex) => (
							<Stack key={(`${imageIndex}-${image.url}`)} boxShadow={2} borderRadius={1} direction='row' padding={1} spacing={2}>
								<Box sx={imageBoxStyle}>
									<ImageBox src={image.url} alt={image.alt} backgroundImageFill />
								</Box>
								<Stack spacing={2} width='100%'>
									<Typography variant='body1'>
										{image.url}
									</Typography>
									<TextField
										size='small'
										variant='standard'
										label="Alt Text"
										fullWidth
										value={image.alt || ''}
										onChange={(e) => editImageAltHandler(imageIndex, e.currentTarget.value)}
									/>
									<TextField
										size='small'
										variant='standard'
										label="Caption"
										fullWidth
										value={image.caption || ''}
										onChange={(e) => editImageCaptionHandler(imageIndex, e.currentTarget.value)}
									/>
									<Box display="flex" alignSelf='end'>
										<SortingControls
											onMoveTop={() => onMoveImageHandler(imageIndex, 'top')}
											onMoveUp={() => onMoveImageHandler(imageIndex, 'up')}
											onDelete={() => removeImageHandler(imageIndex)}
											onMoveDown={() => onMoveImageHandler(imageIndex, 'down')}
											onMoveBottom={() => onMoveImageHandler(imageIndex, 'bottom')}
											canMoveTop={checkImageCanMove(imageIndex, 'top')}
											canMoveUp={checkImageCanMove(imageIndex, 'up')}
											canMoveDown={checkImageCanMove(imageIndex, 'down')}
											canMoveBottom={checkImageCanMove(imageIndex, 'bottom')}
											size="small"
										/>
									</Box>
								</Stack>
							</Stack>
						))}
						<Stack direction='row' spacing={2} alignItems='end' padding={1} boxShadow={2} borderRadius={1} >
							<TextField
								fullWidth
								size='small'
								variant='standard'
								label="New Image URL"
								value={newImageUrl}
								onChange={(e) => setNewImageUrl(e.currentTarget.value)}
							/>
							<Box>
								<IconButton
									size="small"
									disabled={newImageUrl.trim() === ''}
									onClick={() => addImageHandler(newImageUrl)}
								>
									<AddIcon />
								</IconButton>
							</Box>
						</Stack>
					</Stack>
				</AccordionDetails>
			</Accordion>
			{/* display images here */}
		</Box>
	)
}
