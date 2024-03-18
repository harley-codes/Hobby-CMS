'use client'

import { invokeNewProjectRequest } from '@/app/dashboard/projects/_components/CreateProjectDialog'
import { Button } from '@mui/material'

export function CreateProjectButton()
{
	return (
		<Button onClick={() => invokeNewProjectRequest()}>Create Project</Button>
	)
}
