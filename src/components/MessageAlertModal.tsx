'use client'

import { useEffect, useState } from 'react'
import { v4 as newUID } from 'uuid'

import { createEvent } from '@/modules/custom-events/createEvent'
import { mapRecord } from '@/modules/utility/mapRecord'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

type MessageAlertEvent = {
	title?: string,
	description?: string,
	onConfirmed?: () => void
}

type MessageAlertDialog = MessageAlertEvent & {
	display: boolean,
}

let isModalMounted = false

const confirmationEvent = createEvent<MessageAlertEvent>('messageAlertEvent')

export const invokeMessageAlertModal = confirmationEvent.callEvent

export function MessageAlertModal()
{
	const [dialogs, setDialogs] = useState<Record<string, MessageAlertDialog>>({})

	useEffect(() =>
	{
		if (isModalMounted)
			throw new Error('Another MessageAlertModal is already mounted')

		isModalMounted = true

		return () =>
		{
			isModalMounted = false
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

	function confirmationHandler(dialogKey: string)
	{
		const newDialogs = { ...dialogs }
		dialogs[dialogKey].display = false
		setDialogs(newDialogs)
	}

	function finalizeDialogConfirmation(dialogKey: string)
	{
		const dialog = dialogs[dialogKey]
		dialog.onConfirmed?.()

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
						{dialog.title ?? 'Message'}
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{dialog.description ?? 'Click Continue.'}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => confirmationHandler(key)} autoFocus>
							Proceed
						</Button>
					</DialogActions>
				</Dialog>
			))}
		</div>
	)
}
