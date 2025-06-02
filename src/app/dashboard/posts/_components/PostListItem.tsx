'use client'

import { TagsInput } from '@/app/dashboard/posts/_components/TagsInput'
import DatePicker from '@/components/DatePicker'
import { FeaturedImageInput } from '@/components/FeaturedImageInput'
import { MetaDataEditor } from '@/components/MetaDataEditor'
import { PostStatus } from '@/modules/database/models'
import { PostUpdateDetailsValues } from '@/modules/database/requestTypes'
import { PostDetail, ProjectReferenceDetail } from '@/modules/database/responseTypes'
import
{
	Delete as DeleteIcon,
	ExpandMore as ExpandMoreIcon,
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
	Chip,
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
	projectOptions: ProjectReferenceDetail[]
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
		projectOptions,
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
						slotProps={{ htmlInput: { maxLength: 250 } }}
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

					<FormControl fullWidth>
						<InputLabel>Assign Projects</InputLabel>
						<Select
							label="Assign Projects"
							value={projectOptions.filter(x => post.projects.some(p => p.id === x.id)).map(x => x.id)}
							onChange={(e) => updateDetail({
								projects: projectOptions.filter(p => e.target.value.includes(p.id))
							})}
							fullWidth
							multiple
							renderValue={(selected) => projectOptions.filter(x => selected.includes(x.id)).map(x => x.name).join(', ')}
						>
							{projectOptions.map(({ id, name, active }) => (
								<MenuItem key={id} value={id}>
									<Stack direction="row" spacing={2} justifyContent="space-between" width="100%">
										<Typography variant="inherit">{name}</Typography>
										<Chip label="active" size="small" {...(active ? {
											color: 'success',
											variant: 'outlined'
										} : {
											color: 'warning',
											variant: 'outlined'
										})} />
									</Stack>
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Box>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, md: 6 }}>
								<Stack spacing={2}>
									<TextField
										label="Post Description"
										value={post.description ?? ''}
										onChange={(e) => updateDetail({ description: e.currentTarget.value })}
										multiline
										slotProps={{ htmlInput: { maxLength: 500 } }}
										minRows={8}
										ref={descriptionRef}

									/>
								</Stack>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
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
