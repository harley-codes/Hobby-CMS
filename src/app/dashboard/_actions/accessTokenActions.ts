'use server'

import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'
import { AccessTokenDetail } from '@/modules/database/responseTypes'

export async function createProjectTokenServerAction(projectId: string): Promise<AccessTokenDetail>
{
	const client = await getDatabaseClientAsync()
	const token = await client.createAccessTokenAsync(projectId)
	return token
}

export async function deleteProjectTokenServerAction(tokenId: string): Promise<void>
{
	const client = await getDatabaseClientAsync()
	await client.deleteAccessTokenAsync(tokenId)
}
