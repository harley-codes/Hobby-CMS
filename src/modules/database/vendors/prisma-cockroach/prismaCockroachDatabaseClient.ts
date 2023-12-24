import { DatabaseClient } from '@/modules/database/databaseClient'
import { Prisma, PrismaClient } from '@prisma/client'

export class PrismaCockroachDatabaseClient implements DatabaseClient
{
	private prisma: PrismaClient

	constructor()
	{
		this.prisma = new PrismaClient()
	}

	private getPrismaJsonValue<T>(jsonValue: Prisma.JsonValue)
	{
		return (jsonValue?.valueOf() ?? {}) as T
	}

	async getProjectListAsync(): Promise<ProjectDetail[]>
	{
		const projects = await this.prisma.project.findMany({
			select: {
				id: true,
				name: true,
				active: true,
				meta: true,
				accessTokens: {
					select: {
						id: true,
						token: true
					}
				}
			}
		})

		return projects.map(x => ({...x, meta: this.getPrismaJsonValue(x.meta)}))
	}

	async createProjectAsync(name: string): Promise<ProjectDetail>
	{
		const matchingProjectNameCount = await this.prisma.project.count({
			where: {
				name
			}
		})

		if (matchingProjectNameCount > 0)
		{
			throw new Error(`Project with name "${name}" already exists.`)
		}

		const project = await this.prisma.project.create({
			data: {
				name,
				active: true,
				meta: {},
				accessTokens: {
					create: {}
				}
			},
			select: {
				id: true,
				name: true,
				active: true,
				meta: true,
				accessTokens: {
					select: {
						id: true,
						token: true
					}
				}
			}
		})

		return {...project, meta: this.getPrismaJsonValue(project.meta)}
	}
}
