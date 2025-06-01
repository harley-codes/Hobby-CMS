'use client'

import { useEffect, useState } from 'react'
import { v4 as newUID } from 'uuid'

import { createEvent } from '@/modules/custom-events/createEvent'
import { mapRecord } from '@/modules/utility/mapRecord'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from '@mui/material'

type InputTriggerParameters = {
	title?: string,
	description?: string,
	inputLabel?: string,
	onConfirmed: (confirmed: boolean, value: string) => void
}

type InputDialog = InputTriggerParameters & {
	display: boolean,
	confirmation?: boolean,
	currentValue: string
}

let isModalMounted = false

const inputTriggerEvent = createEvent<InputTriggerParameters>('inputTriggerEvent')

export const invokeInputModal = inputTriggerEvent.callEvent

export function InputModal()
{
	const [dialogs, setDialogs] = useState<Record<string, InputDialog>>({})

	useEffect(() =>
	{
		if (isModalMounted)
			throw new Error('Another InputModal is already mounted')

		isModalMounted = true

		return () =>
		{
			isModalMounted = false
		}
	}, [])

	inputTriggerEvent.useEvent((dialog) =>
	{
		const newDialogs = { ...dialogs }
		const uid = newUID()
		newDialogs[uid] = {
			...dialog,
			display: true,
			currentValue: '',
		}
		setDialogs(newDialogs)
	})

	function confirmationHandler(dialogKey: string, confirm: boolean)
	{
		const newDialogs = { ...dialogs }
		dialogs[dialogKey].display = false
		dialogs[dialogKey].confirmation = confirm
		setDialogs(newDialogs)
	}

	function finalizeDialogConfirmation(dialogKey: string)
	{
		const dialog = dialogs[dialogKey]
		dialog.onConfirmed(dialog.confirmation ?? false, dialog.confirmation ? dialog.currentValue : '')

		const newDialogs = { ...dialogs }
		delete newDialogs[dialogKey]
		setDialogs(newDialogs)
	}

	return (
		<div>
			{mapRecord(dialogs, (dialog, key) => (
				<Dialog
					open={dialog.display}
					key={key}
					TransitionProps={{
						onExited: () => finalizeDialogConfirmation(key),
					}}
				>
					<DialogTitle>
						{dialog.title ?? 'Confirmation'}
					</DialogTitle>
					<DialogContent>
						<Stack gap={2}>
							{dialog.description && (
								<DialogContentText>
									{dialog.description}
								</DialogContentText>
							)}
							<TextField
								fullWidth
								autoFocus
								label={dialog.inputLabel ?? 'Input'}
								value={dialog.currentValue}
								onChange={(e) =>
								{
									const newDialogs = { ...dialogs }
									newDialogs[key].currentValue = e.currentTarget.value
									setDialogs(newDialogs)
								}}
								margin='dense'
							/>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => confirmationHandler(key, false)}>Cancel</Button>
						<Button onClick={() => confirmationHandler(key, true)}>
							Proceed
						</Button>
					</DialogActions>
				</Dialog>
			))}
		</div>
	)
}
