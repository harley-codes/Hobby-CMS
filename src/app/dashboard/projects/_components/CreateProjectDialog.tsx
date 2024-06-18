'use client'

import { invokeConfirmationModal } from '@/components/ConfirmationModal'
import { createEvent } from '@/modules/custom-events/createEvent'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useState } from 'react'

const newProjectRequestEvent = createEvent<null>('newProjectRequest')

export const invokeNewProjectRequest = () => newProjectRequestEvent.callEvent(null)

const defaultState = {
	display: false,
	name: '',
	nameInUse: false,
	process: false
}

type Props = {
	currentProjectNames: string[]
	onCreateProject: (name: string) => void
}

export function CreateProjectDialog(props: Props)
{
	const { currentProjectNames, onCreateProject } = props

	const [state, setState] = useState(defaultState)

	newProjectRequestEvent.useEvent(() =>
	{
		setState({ ...defaultState, display: true })
	})

	function setNameHandler(e: React.ChangeEvent<HTMLInputElement>)
	{
		setState({
			...state,
			name: e.currentTarget.value,
			nameInUse: currentProjectNames.includes(e.currentTarget.value)
		})
	}

	function cancelHandler()
	{
		setState({ ...state, display: false, process: false })
	}

	function createStartHandler()
	{
		if (state.nameInUse) return

		invokeConfirmationModal({
			description: `Are you sure you want to create a project named "${state.name}"?`,
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
		if (state.process) onCreateProject(state.name)
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
			<DialogTitle>Create Project</DialogTitle>
			<DialogContent>
				<TextField
					label="Project Name"
					margin="normal"
					fullWidth
					value={state.name}
					onChange={setNameHandler}
					error={state.nameInUse}
					helperText={state.nameInUse ? 'Name already in use' : ' '}
				/>

			</DialogContent>
			<DialogActions>
				<Button onClick={cancelHandler}>Cancel</Button>
				<Button onClick={createStartHandler} disabled={state.nameInUse}>Create</Button>
			</DialogActions>
		</Dialog>
	)
}
