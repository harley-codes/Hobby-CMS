import { CreateProjectButton } from '@/app/dashboard/projects/_components/CreateProjectButton'
import { ProjectsListView } from '@/app/dashboard/projects/_components/ProjectsListView'
import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'
import { Stack, Typography } from '@mui/material'

const getDataAsync = async () =>
{
	const client = await getDatabaseClientAsync()
	const projects = await client.getProjectDetailsAsync()
	return projects
}

export default async function ProjectsPage()
{
	const projects = await getDataAsync()

	return (
		<Stack spacing={2}>
			<Stack direction="row" justifyContent="space-between">
				<Typography variant="h4" component="header">Projects</Typography>
				<CreateProjectButton />
			</Stack>
			<ProjectsListView projects={projects} />
		</Stack>
	)
}
