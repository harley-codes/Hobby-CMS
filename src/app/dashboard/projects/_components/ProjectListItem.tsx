'use client'

import { TokenList } from '@/app/dashboard/projects/_components/TokenList'
import { MetaDataEditor } from '@/components/MetaDataEditor'
import { ProjectUpdateValues } from '@/modules/database/requestTypes'
import { ProjectDetail } from '@/modules/database/responseTypes'
import
{
	Delete as DeleteIcon,
	ExpandMore as ExpandMoreIcon,
	Save as SaveIcon
} from '@mui/icons-material'
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'

type Props = {
	project: ProjectDetail
	expanded: boolean
	detailsChangePending: boolean
	updateDetail: (values: ProjectUpdateValues) => void
	saveProject: () => void
	deleteProject: () => void
	createToken: () => void
	deleteToken: (tokenId: string) => void
	setActiveProject: (projectId: string) => void
}

export function ProjectListItem(props: Props)
{
	const {
		project,
		expanded,
		detailsChangePending,
		updateDetail,
		saveProject,
		deleteProject,
		createToken,
		deleteToken,
		setActiveProject
	} = props

	const [metaDataValid, setMetaDataValid] = useState(true)

	return (
		<Accordion
			expanded={expanded}
			onChange={() => setActiveProject(project.id)}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography variant="h6">{project.name}</Typography>
			</AccordionSummary>

			<AccordionDetails>
				<Stack spacing={2}>
					<TextField
						label="Project Name"
						value={project.name}
						onChange={(e) => updateDetail({ name: e.currentTarget.value })}
					/>


					<FormControl>
						<InputLabel>Project Status</InputLabel>
						<Select
							label="Project Status"
							value={project.active ? 'Enabled' : 'Disabled'}
							onChange={(e) => updateDetail({ active: e.target.value === 'Enabled' })}
						>
							<MenuItem value="Disabled">Disabled</MenuItem>
							<MenuItem value="Enabled">Enabled</MenuItem>
						</Select>
					</FormControl>

					<TokenList
						accessTokens={project.accessTokens}
						createToken={createToken}
						deleteToken={deleteToken}
					/>

					<MetaDataEditor
						meta={project.meta ?? {}}
						onMetaChange={(data) => updateDetail({ meta: data })}
						onDataValidation={(isValid) => setMetaDataValid(isValid)}
					/>
				</Stack>
			</AccordionDetails>

			<AccordionActions>
				<Stack width="100%" padding={1} direction="row" gap={2} display="flex" justifyContent="space-between">
					<Button variant="outlined" color="warning" onClick={deleteProject} endIcon={<DeleteIcon />}>
						Delete
					</Button>
					<Box margin="auto" />
					<Button disabled={!detailsChangePending || !metaDataValid} variant="outlined" onClick={saveProject} endIcon={<SaveIcon />}>
						Save
					</Button>
				</Stack>
			</AccordionActions>
		</Accordion>
	)
}
