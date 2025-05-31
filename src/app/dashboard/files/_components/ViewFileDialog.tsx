'use client'

import { FileTypeIcon } from '@/app/dashboard/files/_components/FileTypeIcon'
import { invokeConfirmationModal } from '@/components/ConfirmationModal'
import { ImageBox } from '@/components/ImageBox'
import { createEvent } from '@/modules/custom-events/createEvent'
import { DataFileDetails } from '@/modules/database/responseTypes'
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Link, List, ListItem, ListItemText, ListSubheader, Stack, TextField } from '@mui/material'
import { useState } from 'react'

const viewFileRequestEvent = createEvent<DataFileDetails>('viewFileRequest')

export const invokeViewFileRequest = viewFileRequestEvent.callEvent

const defaultState = {
	display: false,
	delete: false
}

type Props = {
	onFileDelete: (fileId: string) => void
}

export function ViewFileDialog(props: Props)
{
	const { onFileDelete } = props

	const [state, setState] = useState(defaultState)
	const [dataFile, setDataFile] = useState<DataFileDetails | null>(null)

	const fileLink = dataFile
		? `${window.location.origin}/api/public/files/data/${dataFile.id}`
		: null

	viewFileRequestEvent.useEvent((file) =>
	{
		setState({ ...defaultState, display: true })
		setDataFile(file)
	})

	function cancelHandler()
	{
		setState(defaultState)
	}

	function deleteStartHandler()
	{
		if (!dataFile) return

		invokeConfirmationModal({
			description: 'Are you sure you want to delete this file?',
			onConfirmed: (confirmed) =>
			{
				if (confirmed)
				{
					setState({ ...state, display: false, delete: true })
				}
			}
		})
	}

	function exitHandler()
	{
		if (dataFile && state.delete) onFileDelete(dataFile.id)
		setState(defaultState)
		setDataFile(null)
	}

	return (
		<Dialog
			open={state.display}
			TransitionProps={{
				onExited: exitHandler,
			}}
			fullWidth maxWidth="xs"
		>
			<DialogTitle>File View</DialogTitle>
			<DialogContent>
				{dataFile && (
					<Stack gap={2}>
						<TextField
							label="File Name"
							fullWidth
							margin="dense"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FileTypeIcon extension={dataFile.extension} />
									</InputAdornment>
								),
							}}
							defaultValue={dataFile?.name}
							disabled
							sx={{ marginBottom: 0 }}
						/>

						{dataFile.hasThumbnail && (
							<Box boxShadow={1} borderRadius={1}>
								<ImageBox
									src={`/api/public/files/data/${dataFile.id}`}
									alt={dataFile.name}
									aspectRatio="16/10"
									backgroundImageFill
									borderRadius='0.25em'
								/>
							</Box>
						)}

						{Object.entries(dataFile.meta).length > 0 && (
							<Card sx={{ padding: 0 }}>
								<List
									dense
									disablePadding
									subheader={<ListSubheader>Meta</ListSubheader>}
								>
									{Object.entries(dataFile.meta).map(([key, value]) => (
										<ListItem key={key}>
											<ListItemText sx={{ display: 'flex', justifyContent: 'space-between' }}
												primary={key}
												secondary={value}
											/>
										</ListItem>
									))}
								</List>
							</Card>

						)}

						{fileLink && (
							<Stack paddingX={1.5} paddingBottom={1.5} boxShadow={2} borderRadius={1} color="grey.600">
								<ListSubheader sx={{ margin: 0, padding: 0 }}>Direct Link</ListSubheader>
								<Link href={fileLink} target="_blank" rel="noopener">{fileLink}</Link>
								{dataFile.hasThumbnail && <>
									<ListSubheader sx={{ margin: 0, padding: 0 }}>Thumbnail Link</ListSubheader>
									<Link href={fileLink.replace('/data', '/thumbnail')} target="_blank" rel="noopener">{fileLink.replace('/data', '/thumbnail')}</Link>
								</>}
							</Stack>
						)}
					</Stack>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={cancelHandler}>Close</Button>
				<Button onClick={deleteStartHandler} color='warning'>Delete</Button>
			</DialogActions>
		</Dialog >
	)
}
