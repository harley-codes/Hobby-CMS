'use client'

import { MetaDataEditor } from '@/components/MetaDataEditor'
import { ProjectUpdateValues } from '@/modules/database/requestTypes'
import { ProjectDetail } from '@/modules/database/responseTypes'
import
{
	ContentCopy as ContentCopyIcon,
	Delete as DeleteIcon,
	ExpandMore as ExpandMoreIcon,
	Save as SaveIcon
} from '@mui/icons-material'
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
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

					<TableContainer component={Paper}>
						<Table size="small">
							<TableHead>
								<TableRow>
									<TableCell>Tokens</TableCell>
									<TableCell align="right">
										<Button
											size="small" color="success"
											onClick={createToken}
										>Create New Token</Button>
									</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{project.accessTokens.map((token) => (
									<TableRow key={token.id}>
										<TableCell>
											<Stack
												gap={1} direction="row"
												sx={{
													cursor: 'pointer',
													'&:hover > button': {
														visibility: 'visible'
													}
												}}
											>
												<Typography variant="button">
													{
														token.token.slice(0, 4) +
														'.'.repeat(token.token.length - 8) +
														token.token.slice(-4)
													}
												</Typography>
												<IconButton
													size="small" sx={{ visibility: 'hidden' }}
													onClick={() => navigator.clipboard.writeText(token.token)}
												>
													<ContentCopyIcon fontSize="inherit" />
												</IconButton>
											</Stack>
										</TableCell>
										<TableCell align="right">
											<IconButton
												size="small"
												onClick={() => deleteToken(token.id)}>
												<DeleteIcon fontSize="inherit" />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>

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
