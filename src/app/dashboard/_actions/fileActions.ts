'use server'

import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'
import { NewDataFile } from '@/modules/database/requestTypes'
import { DataFileDetails } from '@/modules/database/responseTypes'

export async function createDataFileServerAction(file: NewDataFile): Promise<DataFileDetails>
{
	const client = await getDatabaseClientAsync()
	const newFile = await client.createDataFileAsync(file)
	return newFile
}
