'use server'

import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'
import { NewDataFile } from '@/modules/database/requestTypes'
import { DataFileDetails, DataFilesPaginatedResponse } from '@/modules/database/responseTypes'

export async function createDataFileServerAction(file: NewDataFile): Promise<DataFileDetails>
{
	const client = await getDatabaseClientAsync()
	const newFile = await client.createDataFileAsync(file)
	return newFile
}

export async function getDataFilesPaginatedServerAction(skip: number, take?: number): Promise<DataFilesPaginatedResponse>
{
	const client = await getDatabaseClientAsync()
	const files = await client.getDataFilesPaginatedAsync(skip, take ?? Number(process.env.PAGINATION_PAGE_SIZE))
	return files
}

export async function getDataFileDetailsServerAction(fileId: string): Promise<DataFileDetails>
{
	const client = await getDatabaseClientAsync()
	const file = await client.getDataFileDetailsAsync(fileId)
	return file
}

export async function deleteDataFileServerAction(fileId: string): Promise<void>
{
	const client = await getDatabaseClientAsync()
	await client.deleteDataFileAsync(fileId)
}
