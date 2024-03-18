'use server'

import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'
import { ProjectUpdateValues } from '@/modules/database/requestTypes'
import { ProjectDetail } from '@/modules/database/responseTypes'

export async function createProjectServerAction(projectName: string, isActive: boolean): Promise<ProjectDetail>
{
	const client = await getDatabaseClientAsync()
	const project = await client.createProjectAsync(projectName, isActive)
	return project
}

export async function deleteProjectServerAction(projectId: string): Promise<void>
{
	const client = await getDatabaseClientAsync()
	await client.deleteProjectAsync(projectId)
}

export async function updateProjectServerAction(projectId: string, values: ProjectUpdateValues): Promise<ProjectDetail>
{
	const client = await getDatabaseClientAsync()
	const project = await client.updateProjectAsync(projectId, values)
	return project
}
