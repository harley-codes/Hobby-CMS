'use client'

import { TagsInput } from '@/app/dashboard/posts/_components/TagsInput'
import DatePicker from '@/components/DatePicker'
import { ImageBox } from '@/components/ImageBox'
import { MetaDataEditor } from '@/components/MetaDataEditor'
import { PostStatus } from '@/modules/database/models'
import { PostUpdateDetailsValues } from '@/modules/database/requestTypes'
import { PostDetail } from '@/modules/database/responseTypes'
import
{
	Delete as DeleteIcon,
	ExpandMore as ExpandMoreIcon,
	Image as ImageIcon,
	Restore as RestoreIcon,
	Save as SaveIcon,
	Subject as SubjectIcon
} from '@mui/icons-material'
import
{
	Accordion,
	AccordionActions,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography
} from '@mui/material'
import { useRef, useState } from 'react'

type Props = {
	post: PostDetail
	expanded: boolean
	detailsChangePending: boolean
	updateDetail: (values: PostUpdateDetailsValues) => void
	savePost: () => void
	deletePost: () => void
	discardChanges: () => void
	setActivePost: () => void
	loadContentRequest: () => void
}

export function PostListItem(props: Props)
{
	const {
		post,
		expanded,
		detailsChangePending,
		updateDetail,
		savePost,
		deletePost,
		discardChanges,
		setActivePost,
		loadContentRequest
	} = props

	const [metaDataValid, setMetaDataValid] = useState(true)

	const descriptionRef = useRef<HTMLInputElement>(null)

	return (
		<Accordion
			expanded={expanded}
			onChange={setActivePost}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography variant="h6">{post.title}</Typography>
			</AccordionSummary>

			<AccordionDetails>
				<Stack spacing={2}>
					<TextField
						label="Post Name"
						value={post.title}
						onChange={(e) => updateDetail({ title: e.currentTarget.value })}
						inputProps={{ maxLength: 250 }}
					/>

					<Stack direction="row" spacing={2}>
						<FormControl fullWidth>
							<DatePicker
								label="Post Date"
								value={post.date}
								onChange={(date) => updateDetail({ date })}
							/>
						</FormControl>


						<FormControl fullWidth>
							<InputLabel>Post Status</InputLabel>
							<Select
								label="Post Status"
								value={post.status}
								onChange={(e) => updateDetail({ status: e.target.value as PostStatus })}
							>
								<MenuItem value="ACTIVE">Active</MenuItem>
								<MenuItem value="DISABLED">Disabled</MenuItem>
								<MenuItem value="HIDDEN">Hidden</MenuItem>
							</Select>
						</FormControl>
					</Stack>
					<Box>
						<Grid container spacing={2}>
							<Grid item xs={12} md={6}>
								<Stack spacing={2}>
									<TextField
										label="Post Description"
										value={post.description ?? ''}
										onChange={(e) => updateDetail({ description: e.currentTarget.value })}
										multiline
										inputProps={{ maxLength: 500 }}
										minRows={8}
										ref={descriptionRef}

									/>
								</Stack>
							</Grid>
							<Grid item xs={12} md={6}>
								<FeaturedImageInput
									featuredImageURL={post.featuredImageURL ?? ''}
									onChange={(value) => updateDetail({ featuredImageURL: value })}
									forcedHeight={descriptionRef.current?.offsetHeight}
								/>
							</Grid>
						</Grid>
					</Box>

					<TagsInput tags={post.tags ?? []} onChange={(value) => updateDetail({ tags: value })} />

					<MetaDataEditor
						meta={post.meta ?? {}}
						onMetaChange={(data) => updateDetail({ meta: data })}
						onDataValidation={(isValid) => setMetaDataValid(isValid)}
					/>
				</Stack>
			</AccordionDetails>

			<AccordionActions>
				<Stack width="100%" padding={1} direction="row" gap={2} display="flex" justifyContent="space-between">
					{detailsChangePending && <Button variant="outlined" color="warning" onClick={discardChanges} endIcon={<RestoreIcon />}>
						Discard Changes
					</Button>}
					{!detailsChangePending && <Button variant="outlined" color="warning" onClick={deletePost} endIcon={<DeleteIcon />}>
						Delete
					</Button>}
					<Box margin="auto" />
					<Button disabled={!detailsChangePending || !metaDataValid} variant="outlined" onClick={savePost} endIcon={<SaveIcon />}>
						Save
					</Button>
					<Button variant="outlined" onClick={loadContentRequest} endIcon={<SubjectIcon />}>
						Edit Content
					</Button>
				</Stack>
			</AccordionActions>
		</Accordion>
	)
}


function FeaturedImageInput(props: { featuredImageURL?: string, forcedHeight?: number, onChange: (value: string) => void })
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
