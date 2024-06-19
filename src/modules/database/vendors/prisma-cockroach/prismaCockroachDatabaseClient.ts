import { DatabaseClient } from '@/modules/database/databaseClient'
import { NewDataFile, PostUpdateBlockValues, PostUpdateDetailsValues, ProjectUpdateValues } from '@/modules/database/requestTypes'
import { AccessTokenDetail, DataFileDetails, DataFilesPaginatedResponse, PostBlocks, PostDetail, ProjectDetail } from '@/modules/database/responseTypes'
import { Prisma, PrismaClient } from '@prisma/client'
import { DateTime } from 'luxon'

// #region Selectors
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

const postDetailSelect = {
	id: true,
	title: true,
	description: true,
	featuredImageURL: true,
	date: true,
	meta: true,
	tags: true,
	status: true
}
// #endregion

export class PrismaCockroachDatabaseClient implements DatabaseClient
{
	private prisma: PrismaClient

	constructor()
	{
		this.prisma = new PrismaClient()
	}

	// #region Project Methods
	async getProjectsAsync(): Promise<ProjectDetail[]>
	{
		const projects = await this.prisma.project.findMany({
			select: projectDetailSelect
		})

		return projects.map(x => ({ ...x, meta: this.getPrismaJsonValue(x.meta) }))
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

		return { ...project, meta: this.getPrismaJsonValue(project.meta) }
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

		return { ...project, meta: this.getPrismaJsonValue(project.meta) }
	}
	// #endregion

	// #region Token Methods
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

		return { ...token, idProject: token.idProject! }
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

	// #region DataFile Methods
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
			date: DateTime.fromMillis(Number(dataFile.date), { zone: 'utc' }).toJSDate(),
			mimeType: dataFile.mimeType,
			extension: dataFile.extension,
			sizeKb: dataFile.sizeKb,
			hasThumbnail: dataFile.hasThumbnail,
			meta: this.getPrismaJsonValue(dataFile.meta)
		}
	}

	async getDataFilesPaginatedAsync(skip: number, take: number): Promise<DataFilesPaginatedResponse>
	{
		const sumPromise = this.prisma.file.count()

		const dataFilePromise = this.prisma.file.findMany({
			orderBy: {
				date: 'desc'
			},
			select: {
				id: true,
				name: true,
				hasThumbnail: true,
				extension: true
			},
			skip,
			take
		})

		const [sum, files] = await Promise.all([sumPromise, dataFilePromise])

		return {
			fileDetails: files,
			totalFiles: sum,
			request: { skip, take }
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
				date: DateTime.utc().toMillis()
			},
		})



		return {
			id: dataFile.id,
			name: dataFile.name,
			date: this.getDateFromBigint(dataFile.date),
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

	// #region Posts Methods
	async getPostsAsync(): Promise<PostDetail[]>
	{
		const posts = await this.prisma.post.findMany({
			select: postDetailSelect
		})

		return posts.map(x => ({
			...x,
			meta: this.getPrismaJsonValue(x.meta),
			date: this.getDateFromBigint(x.date),
			tags: this.getPrismaJsonValue<string[]>(x.tags)
		}))
	}

	async getPostBlocksAsync(postId: string): Promise<PostBlocks>
	{
		const post = await this.prisma.post.findUnique({
			where: {
				id: postId
			},
			select: {
				id: true,
				blocks: true
			}
		})

		if (!post)
		{
			throw new Error(`Post with id "${postId}" not found.`)
		}

		return {
			...post,
			blocks: this.getPrismaJsonValue<Record<string, Record<string, string>>>(post.blocks)
		}
	}

	async createPostAsync(title: string): Promise<PostDetail>
	{
		const post = await this.prisma.post.create({
			data: {
				title,
				date: DateTime.utc().toMillis(),
				meta: {},
				tags: [],
				status: 'DISABLED',
				blocks: {}
			},
			select: postDetailSelect
		})

		return {
			...post,
			meta: this.getPrismaJsonValue(post.meta),
			date: this.getDateFromBigint(post.date),
			tags: this.getPrismaJsonValue<string[]>(post.tags)
		}
	}

	async deletePostAsync(postId: string): Promise<void>
	{
		await this.prisma.post.delete({
			where: {
				id: postId
			}
		})
	}

	async updatePostDetailsAsync(postId: string, values: PostUpdateDetailsValues): Promise<PostDetail>
	{
		const post = await this.prisma.post.update({
			where: {
				id: postId
			},
			data: {
				...values,
				date: values.date ? this.getBigintFromDate(values.date) : undefined,
			},
			select: postDetailSelect
		})

		return {
			...post,
			meta: this.getPrismaJsonValue(post.meta),
			date: this.getDateFromBigint(post.date),
			tags: this.getPrismaJsonValue<string[]>(post.tags)
		}
	}

	async updatePostBlocksAsync(postId: string, values: PostUpdateBlockValues): Promise<PostBlocks>
	{
		const post = await this.prisma.post.update({
			where: {
				id: postId
			},
			data: {
				blocks: values.blocks
			},
			select: {
				id: true,
				blocks: true
			}
		})

		return {
			...post,
			blocks: this.getPrismaJsonValue<Record<string, Record<string, string>>>(post.blocks)
		}

	}
	// #endregion

	// #region Private Methods
	private getBigintFromDate(date: Date): bigint
	{
		return BigInt(DateTime.fromJSDate(date, { zone: 'utc' }).toMillis())
	}

	private getDateFromBigint(date: bigint): Date
	{
		return DateTime.fromMillis(Number(date), { zone: 'utc' }).toJSDate()
	}

	private getPrismaJsonValue<T>(jsonValue: Prisma.JsonValue)
	{
		return (jsonValue?.valueOf() ?? {}) as T
	}
	// #endregion
}
