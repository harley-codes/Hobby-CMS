import { DatabaseClient } from '@/modules/database/databaseClient'
import { NewDataFile, ProjectUpdateValues } from '@/modules/database/requestTypes'
import { AccessTokenDetail, DataFileDetails, ProjectDetail } from '@/modules/database/responseTypes'
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

	// #region Project
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
	// #endregion

	// #region Token
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
	// #endregion

	// #region DataFile
	async getDataFileDetailsAsync(fileId: string): Promise<DataFileDetails>
	{
		const dataFile = await this.prisma.file.findUnique({
			where: {
				id: fileId
			},
			select: {
				id: true,
				name: true,
				date: true,
				mimeType: true,
				extension: true,
				sizeKb: true,
				hasThumbnail: true,
				meta: true,
			}
		})

		if (!dataFile)
		{
			throw new Error(`Data file with id "${fileId}" not found.`)
		}

		return {
			id: dataFile.id,
			name: dataFile.name,
			date: new Date(dataFile.date),
			mimeType: dataFile.mimeType,
			extension: dataFile.extension,
			sizeKb: dataFile.sizeKb,
			hasThumbnail: dataFile.hasThumbnail,
			meta: this.getPrismaJsonValue(dataFile.meta)
		}
	}

	async getDataFileDataAsync(fileId: string): Promise<string>
	{
		const dataFile = await this.prisma.file.findUnique({
			where: {
				id: fileId
			},
			select: {
				data64: true
			}
		})

		if (!dataFile)
		{
			throw new Error(`Data file with id "${fileId}" not found.`)
		}

		return dataFile.data64
	}

	async getDataFileThumbnailAsync(fileId: string): Promise<string>
	{
		const dataFile = await this.prisma.file.findUnique({
			where: {
				id: fileId
			},
			select: {
				thumbnail64: true
			}
		})

		if (!dataFile)
		{
			throw new Error(`Data file with id "${fileId}" not found.`)
		}

		if (!dataFile.thumbnail64)
		{
			throw new Error(`Data file with id "${fileId}" does not have a thumbnail.`)
		}

		return dataFile.thumbnail64
	}

	async createDataFileAsync(file: NewDataFile): Promise<DataFileDetails>
	{
		const dataFile = await this.prisma.file.create({
			data: {
				...file,
				date: new Date().getTime()
			},
		})

		return {
			id: dataFile.id,
			name: dataFile.name,
			date: new Date(dataFile.date),
			mimeType: dataFile.mimeType,
			extension: dataFile.extension,
			sizeKb: dataFile.sizeKb,
			hasThumbnail: dataFile.hasThumbnail,
			meta: this.getPrismaJsonValue(dataFile.meta)
		}
	}

	async deleteDataFileAsync(fileId: string): Promise<void>
	{
		await this.prisma.file.delete({
			where: {
				id: fileId
			}
		})
	}
	// #endregion

	private getPrismaJsonValue<T>(jsonValue: Prisma.JsonValue)
	{
		return (jsonValue?.valueOf() ?? {}) as T
	}
}
