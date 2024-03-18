import { DatabaseClient } from '@/modules/database/databaseClient'
import { ProjectUpdateValues } from '@/modules/database/requestTypes'
import { AccessTokenDetail, ProjectDetail } from '@/modules/database/responseTypes'
import { Prisma, PrismaClient } from '@prisma/client'

const projectDetailSelect = {
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

export class PrismaCockroachDatabaseClient implements DatabaseClient
{
	private prisma: PrismaClient

	constructor()
	{
		this.prisma = new PrismaClient()
	}

	//Project
	async getProjectsAsync(): Promise<ProjectDetail[]>
	{
		const projects = await this.prisma.project.findMany({
			select: projectDetailSelect
		})

		return projects.map(x => ({...x, meta: this.getPrismaJsonValue(x.meta)}))
	}

	async createProjectAsync(name: string, isActive: boolean): Promise<ProjectDetail>
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
				active: isActive,
				meta: {},
				accessTokens: {
					create: {}
				}
			},
			select: projectDetailSelect
		})

		return {...project, meta: this.getPrismaJsonValue(project.meta)}
	}

	async deleteProjectAsync(projectId: string): Promise<void>
	{
		await this.prisma.project.delete({
			where: {
				id: projectId
			}
		})
	}

	async updateProjectAsync(projectId: string, values: ProjectUpdateValues): Promise<ProjectDetail>
	{
		const project = await this.prisma.project.update({
			where: {
				id: projectId
			},
			data: {
				...values
			},
			select: projectDetailSelect
		})

		return {...project, meta: this.getPrismaJsonValue(project.meta)}
	}

	//Token
	async createAccessTokenAsync(projectId: string): Promise<AccessTokenDetail>
	{
		const token = await this.prisma.accessToken.create({
			data: {
				project: {
					connect: {
						id: projectId
					}
				}
			},
			select: {
				id: true,
				token: true,
				idProject: true,
			}
		})

		return {...token, idProject: token.idProject!}
	}

	async deleteAccessTokenAsync(tokenId: string): Promise<void>
	{
		await this.prisma.accessToken.delete({
			where: {
				id: tokenId
			}
		})
	}

	private getPrismaJsonValue<T>(jsonValue: Prisma.JsonValue)
	{
		return (jsonValue?.valueOf() ?? {}) as T
	}
}
