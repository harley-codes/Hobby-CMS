import { ProjectList } from '@/app/dashboard/projects/_components/ProjectList'
import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'
import { Stack, Typography } from '@mui/material'

const getProjectsAsync = async () =>
{
	const client = await getDatabaseClientAsync()
	const projects = await client.getProjectListAsync()
	console.warn('projects', projects)
	return projects
}

export default async function ProjectsPage()
{
	const projects = await getProjectsAsync()

	return (
		<Stack gap={1}>
			<Typography variant="h4" component="header">Projects</Typography>
			<ProjectList projects={projects} />
		</Stack>
	)
}
