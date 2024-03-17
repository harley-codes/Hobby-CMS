'use client'

import { createEvent } from '@/modules/custom-events/createEvent'
import { Dialog, DialogContent, LinearProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

type LoadingEvent = {
	display: boolean
	textOverride?: string
}

let isLoadingModalMounted = false

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
}

const loadingEvent = createEvent<LoadingEvent>('loadingEvent')

export const invokeLoadingModal = loadingEvent.callEvent

export default function LoadingModal()
{
	const [state, setState] = useState<LoadingEvent>({
		display: false,
		textOverride: undefined
	})

	const label = typeof state.textOverride !== 'undefined' ? state.textOverride : 'Loading'

	useEffect(() =>
	{
		if (isLoadingModalMounted)
			throw new Error('Another LoadingModal is already mounted')

		isLoadingModalMounted = true

		return () =>
		{
			isLoadingModalMounted = false
		}
	}, [])

	loadingEvent.useEvent((event) => setState(event))

	return (
		<Dialog open={state.display} fullWidth maxWidth="xs">
			<DialogContent>
				<Typography variant="h6">{label}</Typography>
				<LinearProgress />
			</DialogContent>
		</Dialog>
	)
}
