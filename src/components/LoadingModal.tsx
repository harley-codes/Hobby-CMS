'use client'

import { createEvent } from '@/modules/custom-events/createEvent'
import { Dialog, DialogContent, LinearProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

type LoadingEvent = {
	display: boolean
	textOverride?: string
}

let isModalMounted = false

const loadingEvent = createEvent<LoadingEvent>('loadingEvent')

export const invokeLoadingModal = loadingEvent.callEvent

export function LoadingModal()
{
	const [state, setState] = useState<LoadingEvent>({
		display: false,
		textOverride: undefined
	})

	const label = typeof state.textOverride !== 'undefined' ? state.textOverride : 'Loading'

	useEffect(() =>
	{
		if (isModalMounted)
			throw new Error('Another LoadingModal is already mounted')

		isModalMounted = true

		return () =>
		{
			isModalMounted = false
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
