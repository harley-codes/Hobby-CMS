'use client'

import { useEffect, useState } from 'react'
import { v4 as newUID } from 'uuid'

import { MetaDataEditor } from '@/components/MetaDataEditor'
import { createEvent } from '@/modules/custom-events/createEvent'
import { mapRecord } from '@/modules/utility/mapRecord'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

type MetadataEditorEvent = {
	data: Record<string, string>,
	onComplete: (data: Record<string, string>) => void
}

type MetaDataEditorDialog = MetadataEditorEvent & {
	currentData: Record<string, string>,
	isValid: boolean,
	display: boolean,
	confirmation?: boolean
}

let isModalMounted = false

const metadataEditorEvent = createEvent<MetadataEditorEvent>('metadataEditorEvent')

export const invokeMetaDataEditorModal = metadataEditorEvent.callEvent

export function MetaDataEditorModal()
{
	const [dialogs, setDialogs] = useState<Record<string, MetaDataEditorDialog>>({})

	useEffect(() =>
	{
		if (isModalMounted)
			throw new Error('Another MetaDataEditorModal is already mounted')

		isModalMounted = true

		return () =>
		{
			isModalMounted = false
		}
	}, [])

	metadataEditorEvent.useEvent((dialog) =>
	{
		const newDialogs = { ...dialogs }
		const uid = newUID()
		newDialogs[uid] = {
			...dialog,
			display: true,
			currentData: dialog.data || {},
			isValid: true,
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
		dialog.onComplete(dialog.confirmation && dialog.isValid ? dialog.currentData : dialog.data)

		const newDialogs = { ...dialogs }
		delete newDialogs[dialogKey]
		setDialogs(newDialogs)
	}

	function updateDialogCurrentMetadata(dialogKey: string, data: Record<string, string>)
	{
		const newDialogs = { ...dialogs }
		newDialogs[dialogKey].currentData = data
		setDialogs(newDialogs)
	}

	function updateDialogValidation(dialogKey: string, isValid: boolean)
	{
		const newDialogs = { ...dialogs }
		newDialogs[dialogKey].isValid = isValid
		setDialogs(newDialogs)
	}

	return (
		<div>
			{mapRecord(dialogs, (dialog, dialogKey) => (
				<Dialog
					open={dialog.display}
					key={dialogKey}
					TransitionProps={{
						onExited: () => finalizeDialogConfirmation(dialogKey),
					}}
					fullWidth maxWidth="md"
				>
					<DialogTitle>Metadata Editor</DialogTitle>
					<DialogContent>
						<MetaDataEditor
							meta={dialog.currentData ?? {}}
							onMetaChange={(data) => updateDialogCurrentMetadata(dialogKey, data)}
							onDataValidation={(isValid) => updateDialogValidation(dialogKey, isValid)}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => confirmationHandler(dialogKey, false)}>Cancel</Button>
						<Button onClick={() => confirmationHandler(dialogKey, true)} autoFocus disabled={!dialog.isValid} title={!dialog.isValid ? 'Metadata is not valid' : ''}>
							Done
						</Button>
					</DialogActions>
				</Dialog>
			))}
		</div>
	)
}
