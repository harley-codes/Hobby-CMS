import { DatabaseClient } from '@/modules/database/databaseClient'
import { PrismaClient } from '@prisma/client'

export class PrismaCockroachDatabaseClient implements DatabaseClient
{
	private prisma: PrismaClient

	constructor()
	{
		this.prisma = new PrismaClient()
	}

	async getProjectListAsync(): Promise<ProjectListItem[]>
	{
		const projects = await this.prisma.project.findMany({
			select: {
				id: true,
				name: true,
				active: true,
			}
		})

		return projects
	}
}
