import { DatabaseClient } from '@/modules/database/databaseClient'
import { PrismaCockroachDatabaseClient } from '@/modules/database/vendors/prisma-cockroach/prismaCockroachDatabaseClient'
import { PrismaPostgresDatabaseClient } from '@/modules/database/vendors/prisma-postgres/prismaPostgresDatabaseClient'

export function getDatabaseClientAsync(): Promise<DatabaseClient>
{
	const databaseTargetService = process.env.DATABASE_TARGET_SERVICE

	if (!databaseTargetService)
	{
		throw new Error('DATABASE_TARGET_SERVICE environment variable is not set')
	}

	let databaseClient: DatabaseClient

	switch (databaseTargetService)
	{
		case 'prisma-cockroach':
			databaseClient = new PrismaCockroachDatabaseClient()
			break
		case 'prisma-postgres':
			databaseClient = new PrismaPostgresDatabaseClient()
			break
		default:
			throw new Error(`Unsupported database service: ${databaseTargetService}`)
	}

	return Promise.resolve(databaseClient)
}
