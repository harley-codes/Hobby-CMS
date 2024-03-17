'use client'

import { newProjectEvent } from '@/modules/custom-events/events/newProjectEvent'
import { Button } from '@mui/material'

export function CreateProjectButton()
{
	return (
		<Button onClick={() => newProjectEvent.callEvent(null)}>Create Project</Button>
	)
}
