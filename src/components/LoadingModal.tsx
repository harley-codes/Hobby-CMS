'use client'

import { createEvent } from '@/modules/custom-events/createEvent'
import { Dialog, DialogContent, LinearProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

type LoadingEvent = {
	display: boolean
	textOverride?: string
}

let isLoadingModalMounted = false

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
