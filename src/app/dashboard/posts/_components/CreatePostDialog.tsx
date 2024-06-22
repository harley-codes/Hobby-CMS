'use client'

import { invokeConfirmationModal } from '@/components/ConfirmationModal'
import { invokeMessageAlertModal } from '@/components/MessageAlertModal'
import { createEvent } from '@/modules/custom-events/createEvent'
import { ProjectListDetail } from '@/modules/database/responseTypes'
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'

const newPostRequestEvent = createEvent<null>('newPostRequest')

export const invokeNewPostRequest = () => newPostRequestEvent.callEvent(null)

const defaultState = {
	display: false,
	name: '',
	nameInUse: false,
	projectId: '',
	projectSelected: false,
	process: false
}

type Props = {
	currentPostNames: string[]
	projects: ProjectListDetail[]
	onCreatePost: (name: string, projectId: string) => void
}

export function CreatePostDialog(props: Props)
{
	const { currentPostNames, projects, onCreatePost } = props

	const [state, setState] = useState(defaultState)

	newPostRequestEvent.useEvent(() =>
	{
		setState({ ...defaultState, display: true })
	})

	function setNameHandler(e: React.ChangeEvent<HTMLInputElement>)
	{
		setState({
			...state,
			name: e.currentTarget.value,
			nameInUse: currentPostNames.includes(e.currentTarget.value)
		})
	}

	function setProjectHandler(e: SelectChangeEvent<string>)
	{
		setState({
			...state,
			projectId: e.target.value,
			projectSelected: !!e.target.value
		})
	}

	function cancelHandler()
	{
		setState({ ...state, display: false, process: false })
	}

	function createStartHandler()
	{
		if (state.nameInUse) return

		if (!state.name.trim())
		{
			invokeMessageAlertModal({
				title: 'Missing Name',
				description: 'You must choose a name first, and cannot by only spaces.',
			})
			return
		}

		if (!state.projectSelected)
		{
			invokeMessageAlertModal({
				title: 'Missing Project',
				description: 'You must choose a project first.',
			})
			return
		}

		invokeConfirmationModal({
			description: `Are you sure you want to create a post named "${state.name}"?`,
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
		if (state.process) onCreatePost(state.name, state.projectId)
		setState(defaultState)
	}

	return (
		<Dialog
			open={state.display}
			TransitionProps={{
				onExited: exitHandler,
			}}
			fullWidth maxWidth="xs"
		>
			<DialogTitle>Create Post</DialogTitle>
			<DialogContent>
				<TextField
					label="Post Name"
					margin="normal"
					fullWidth
					value={state.name}
					onChange={setNameHandler}
					error={state.nameInUse}
					helperText={state.nameInUse ? 'Name already in use' : ' '}
				/>
				<FormControl fullWidth>
					<InputLabel>Assign Project</InputLabel>
					<Select
						label="Project Status"
						value={projects.find(x => x.id === state.projectId)?.id}
						onChange={setProjectHandler}
						fullWidth
					>
						{projects.map(({ id, name, active }) => (
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
			</DialogContent>
			<DialogActions>
				<Button onClick={cancelHandler}>Cancel</Button>
				<Button onClick={createStartHandler} disabled={state.nameInUse}>Create</Button>
			</DialogActions>
		</Dialog>
	)
}
