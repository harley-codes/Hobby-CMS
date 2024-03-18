'use client'

import { useEffect, useState } from 'react'
import { v4 as newUID } from 'uuid'

import { createEvent } from '@/modules/custom-events/createEvent'
import { mapRecord } from '@/modules/utility/mapRecord'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

type ConfirmationEvent = {
	title?: string,
	description?: string,
	onConfirmed: (confirmed: boolean) => void
}

type ConfirmationDialog = ConfirmationEvent & {
	display: boolean,
	confirmation?: boolean
}

let isConfirmationModalMounted = false

const confirmationEvent = createEvent<ConfirmationEvent>('confirmationEvent')

export const invokeConfirmationModal = confirmationEvent.callEvent

export function ConfirmationModal()
{
	const [dialogs, setDialogs] = useState<Record<string, ConfirmationDialog>>({})

	useEffect(() =>
	{
		if (isConfirmationModalMounted)
			throw new Error('Another ConfirmationModal is already mounted')

		isConfirmationModalMounted = true

		return () =>
		{
			isConfirmationModalMounted = false
		}
	}, [])

	confirmationEvent.useEvent((dialog) =>
	{
		const newDialogs = { ...dialogs }
		const uid = newUID()
		newDialogs[uid] = {
			...dialog,
			display: true,
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
		dialog.onConfirmed(dialog.confirmation ?? false)

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
						<DialogContentText>
							{dialog.description ?? 'Are you sure you want to proceed?'}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => confirmationHandler(key, false)}>Cancel</Button>
						<Button onClick={() => confirmationHandler(key, true)} autoFocus>
							Proceed
						</Button>
					</DialogActions>
				</Dialog>
			))}
		</div>
	)
}
