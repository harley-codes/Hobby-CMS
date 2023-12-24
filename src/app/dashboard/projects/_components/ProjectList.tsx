'use client'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Button, FormControlLabel, Switch, TextField, Typography } from '@mui/material'
import { signal } from '@preact/signals-react'
import Enumerable from 'linq'

type Props = {
	projects: ProjectDetail[]
}

export function ProjectList(props: Props)
{
	const projects = signal(props.projects)
	const activeProject = signal(Enumerable.from(props.projects).firstOrDefault() ?? null)
	const isSaving = signal(false)

	if (projects.value.length === 0)
	{
		return (
			<Accordion disabled>
				<AccordionSummary>
					<Typography variant="h6">No projects created yet...</Typography>
				</AccordionSummary>
			</Accordion>
		)
	}

	function isSameProject(project1: ProjectDetail | null, project2: ProjectDetail | null)
	{
		return project1?.id === project2?.id
	}

	async function updateActiveProject()
	{
		console.log('Update Project')
		isSaving.value = true
	}

	return (
		<div>
			{projects.value.map((project) => (
				<Accordion
					key={project.id}
					expanded={isSameProject(activeProject.value, project)}
					disabled={isSameProject(activeProject.value, project) && isSaving.value}
				>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant="h6">{project.name}</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<TextField
							label="Project Name"
							defaultValue={project.name}
							{...(isSameProject(activeProject.value, project) ? {
								value: activeProject.value!.name,
								onChange: (e) => { activeProject.value!.name = e.currentTarget.value }
							} : {})}
						/>
						<FormControlLabel
							label="Active"
							labelPlacement='start'
							defaultChecked={project.active}
							{...(isSameProject(activeProject.value, project) ? {
								value: activeProject.value!.active,
								// TODO: Update type casting when MUI fixes the issue
								onChange: (e) => { activeProject.value!.active = (e.target as HTMLInputElement).checked }
							} : {})}
							control={<Switch />}
						/>
						<Button onClick={updateActiveProject}>Update</Button>
					</AccordionDetails>
				</Accordion>
			))}
		</div>
	)
}
