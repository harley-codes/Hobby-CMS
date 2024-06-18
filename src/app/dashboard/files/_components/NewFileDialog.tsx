'use client'

import { FileTypeIcon } from '@/app/dashboard/files/_components/FileTypeIcon'
import { invokeConfirmationModal } from '@/components/ConfirmationModal'
import { ImageBox } from '@/components/ImageBox'
import { createEvent } from '@/modules/custom-events/createEvent'
import { NewDataFile } from '@/modules/database/requestTypes'
import { Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, List, ListItem, ListItemText, ListSubheader, TextField } from '@mui/material'
import { useState } from 'react'

const newFileRequestEvent = createEvent<NewDataFile>('newFileRequest')

export const invokeNewFileRequest = newFileRequestEvent.callEvent

const defaultState = {
	display: false,
	process: false
}

type Props = {
	onFileUpload: (newFile: NewDataFile) => void
}

export function NewFileDialog(props: Props)
{
	const { onFileUpload } = props

	const [state, setState] = useState(defaultState)
	const [dataFile, setDataFile] = useState<NewDataFile | null>(null)
	const [nameValidation, setNameValidation] = useState(' ')

	newFileRequestEvent.useEvent((file) =>
	{
		setState({ ...defaultState, display: true })
		setDataFile(file)
	})

	function cancelHandler()
	{
		setState(defaultState)
	}

	function nameChangeHandler(e: React.ChangeEvent<HTMLInputElement>)
	{
		if (!dataFile) return

		setDataFile({ ...dataFile, name: e.currentTarget.value })
		setNameValidation(e.currentTarget.value.trim() ? ' ' : 'Name is required')
	}

	function createStartHandler()
	{
		if (!dataFile) return

		invokeConfirmationModal({
			description: 'Are you sure you want to upload this file?',
			onConfirmed: (confirmed) =>
			{
				if (confirmed)
				{
					setState({ ...state, display: false, process: true })
				}
			}
		})
	}

	function exitHandler()
	{
		if (dataFile && state.process) onFileUpload(dataFile)
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
			<DialogTitle>New File</DialogTitle>
			<DialogContent>
				{dataFile && (<>
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
						value={dataFile?.name}
						onChange={nameChangeHandler}
						error={nameValidation !== ' '}
						helperText={nameValidation}
					/>
					{dataFile.hasThumbnail && (
						<ImageBox
							src={dataFile.data64}
							alt={dataFile.name}
							aspectRatio="16/10"
							backgroundImageFill
							borderRadius='0.25em'
						/>
					)}

					{Object.entries(dataFile.meta).length > 0 && (
						<Card sx={{ padding: 0, marginTop: '2em' }}>
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
				</>)}
			</DialogContent>
			<DialogActions>
				<Button onClick={cancelHandler}>Cancel</Button>
				<Button onClick={createStartHandler} disabled={nameValidation !== ' '}>Create</Button>
			</DialogActions>
		</Dialog >
	)
}
