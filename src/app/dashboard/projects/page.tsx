import { CreateProjectButton } from '@/app/dashboard/projects/_components/CreateProjectButton'
import { ProjectView } from '@/app/dashboard/projects/_components/ProjectView'
import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'
import { Stack, Typography } from '@mui/material'

const getProjectsAsync = async () =>
{
	const client = await getDatabaseClientAsync()
	const projects = await client.getProjectsAsync()
	return projects
}

export default async function ProjectsPage()
{
	const projects = await getProjectsAsync()

	return (
		<Stack spacing={2}>
			<Stack direction="row" justifyContent="space-between">
				<Typography variant="h4" component="header">Projects</Typography>
				<CreateProjectButton />
			</Stack>
			<ProjectView projects={projects} />
		</Stack>
	)
}
