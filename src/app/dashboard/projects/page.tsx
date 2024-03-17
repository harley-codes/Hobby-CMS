import { CreateProjectButton } from '@/app/dashboard/projects/_components/CreateProjectButton'
import { ProjectList } from '@/app/dashboard/projects/_components/ProjectList'
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
		<Stack gap={1}>
			<Stack direction="row" justifyContent="space-between">
				<Typography variant="h4" component="header">Projects</Typography>
				<CreateProjectButton />
			</Stack>
			<ProjectList projects={projects} />
			{/* <CreateProjectDialog /> */}
		</Stack>
	)
}
