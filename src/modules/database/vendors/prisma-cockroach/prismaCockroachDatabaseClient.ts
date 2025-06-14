import { DatabaseClient } from '@/modules/database/databaseClient'
import { PostBlockList } from '@/modules/database/models'
import { NewDataFile, PostUpdateDetailsValues, ProjectUpdateValues } from '@/modules/database/requestTypes'
import
{
	AccessTokenDetail,
	DashboardDetails,
	DataFileDetails,
	DataFilesPaginatedResponse,
	PostBlockDetails,
	PostDetail,
	PostDetailPublic,
	PostDetailsPaginatedPublic,
	ProjectDetail,
	ProjectDetailPublic,
	ProjectReferenceDetail
} from '@/modules/database/responseTypes'
import { Prisma, PrismaClient } from '@prisma/client'
import { InputJsonArray } from '@prisma/client/runtime/library'
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
			token: true,
			allowedHost: true,
		}
	},
	description: true,
	featuredImageURL: true
}

const postDetailSelect = {
	id: true,
	title: true,
	description: true,
	featuredImageURL: true,
	date: true,
	meta: true,
	tags: true,
	status: true,
	projects: true
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
	async getProjectDetailsAsync(): Promise<ProjectDetail[]>
	{
		const projects = await this.prisma.project.findMany({
			select: projectDetailSelect
		})

		return projects.map(x => ({ ...x, meta: this.getPrismaJsonValue(x.meta) }))
	}

	async getProjectDetailsPublicAsync(accessToken: string, hostAddress: string): Promise<ProjectDetailPublic | null>
	{
		const project = await this.prisma.project.findFirst({
			where: {
				active: true,
				accessTokens: {
					some: {
						token: accessToken,
						allowedHost: {
							in: [hostAddress, ''],
							mode: 'insensitive'
						}
					}
				}
			},
			select: {
				name: true,
				description: true,
				featuredImageURL: true,
				meta: true
			}
		})

		if (!project) return null

		return {
			...project,
			meta: this.getPrismaJsonValue(project.meta)
		}
	}

	async getProjectListDetailsAsync(): Promise<ProjectReferenceDetail[]>
	{
		const projects = await this.prisma.project.findMany({
			select: {
				id: true,
				name: true,
				active: true
			}
		})

		return projects
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
				accessTokens: {}
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
	async createAccessTokenAsync(projectId: string, allowedHost: string): Promise<AccessTokenDetail>
	{
		const token = await this.prisma.accessToken.create({
			data: {
				allowedHost,
				project: {
					connect: {
						id: projectId
					}
				}
			},
			select: {
				id: true,
				token: true,
				allowedHost: true,
				idProject: true,
			}
		})

		return token
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
	async getPostsDetailsAsync(projectId?: string): Promise<PostDetail[]>
	{
		const posts = await this.prisma.post.findMany({
			select: postDetailSelect,
			where: !projectId ? {} : {
				idProject: {
					equals: projectId
				}
			},
			orderBy: {
				date: 'desc'
			},
		})

		return posts.map(x => ({
			...x,
			meta: this.getPrismaJsonValue(x.meta),
			date: this.getDateFromBigint(x.date),
			tags: this.getPrismaJsonValue<string[]>(x.tags),
			projects: x.projects.map(p => ({
				id: p.id,
				name: p.name,
				active: p.active
			}))
		}))
	}

	async getPostDetailsPublicAsync(accessToken: string, hostAddress: string, postId: string, includeBlocks: boolean): Promise<PostDetailPublic | null>
	{
		const post = await this.prisma.post.findUnique({
			select: {
				id: true,
				title: true,
				description: true,
				featuredImageURL: true,
				date: true,
				meta: true,
				tags: true,
				status: true,
				blocks: includeBlocks,
			},
			where: {
				id: postId,
				projects: {
					some: {
						accessTokens: {
							some: {
								token: accessToken,
								allowedHost: {
									in: [hostAddress, ''],
									mode: 'insensitive'
								}
							}
						}
					}
				},
				status: {
					in: ['ACTIVE', 'HIDDEN']
				}
			}
		})

		if (!post) return null

		return {
			...post,
			meta: this.getPrismaJsonValue(post.meta),
			date: this.getDateFromBigint(post.date),
			tags: this.getPrismaJsonValue<string[]>(post.tags),
			blocks: post.blocks ? this.getPrismaJsonValue<PostBlockList>(post.blocks) : []
		}
	}

	async getPostsDetailsPublicAsync(accessToken: string, hostAddress: string, includeBlocks: boolean, showHidden: boolean, skip: number, take: number): Promise<PostDetailsPaginatedPublic>
	{
		const whereClause: Prisma.PostWhereInput = {
			projects: {
				some: {
					accessTokens: {
						some: {
							token: accessToken,
							allowedHost: {
								in: [hostAddress, ''],
								mode: 'insensitive'
							}
						}
					}
				}
			},
			status: {
				in: showHidden ? ['ACTIVE', 'HIDDEN'] : ['ACTIVE']
			}
		}

		const sumPromise = this.prisma.post.count({
			where: whereClause
		})

		const postsPromise = this.prisma.post.findMany({
			select: {
				id: true,
				title: true,
				description: true,
				featuredImageURL: true,
				date: true,
				meta: true,
				tags: true,
				status: true,
				blocks: includeBlocks,
			},
			where: whereClause,
			orderBy: {
				date: 'desc'
			},
			skip,
			take
		})

		const [sum, posts] = await Promise.all([sumPromise, postsPromise])

		return {
			totalPosts: sum,
			request: { skip, take },
			posts: posts.map(x => ({
				...x,
				meta: this.getPrismaJsonValue(x.meta),
				date: this.getDateFromBigint(x.date),
				tags: this.getPrismaJsonValue<string[]>(x.tags),
				blocks: x.blocks ? this.getPrismaJsonValue<PostBlockList>(x.blocks) : []
			}))
		}
	}

	async getPostBlocksAsync(postId: string): Promise<PostBlockDetails>
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
			blocks: this.getPrismaJsonValue<PostBlockList>(post.blocks)
		}
	}

	async createPostAsync(title: string, projectIds: string[]): Promise<PostDetail>
	{
		const post = await this.prisma.post.create({
			data: {
				title,
				date: DateTime.utc().toMillis(),
				meta: {},
				tags: [],
				status: 'DISABLED',
				blocks: [],
				projects: {
					connect: projectIds.map(id => ({ id }))
				}
			},
			select: postDetailSelect
		})

		return {
			...post,
			meta: this.getPrismaJsonValue(post.meta),
			date: this.getDateFromBigint(post.date),
			tags: this.getPrismaJsonValue<string[]>(post.tags),
			projects: post.projects.map(p => ({
				id: p.id,
				name: p.name,
				active: p.active
			}))
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
				projects: {
					set: values.projects?.map(p => ({ id: p.id })) ?? []
				}
			},
			select: postDetailSelect
		})

		return {
			...post,
			meta: this.getPrismaJsonValue(post.meta),
			date: this.getDateFromBigint(post.date),
			tags: this.getPrismaJsonValue<string[]>(post.tags),
			projects: post.projects.map(p => ({
				id: p.id,
				name: p.name,
				active: p.active
			}))
		}
	}

	async updatePostBlocksAsync(postId: string, values: PostBlockList): Promise<PostBlockDetails>
	{
		const post = await this.prisma.post.update({
			where: {
				id: postId
			},
			data: {
				blocks: values as InputJsonArray
			},
			select: {
				id: true,
				blocks: true
			}
		})

		return {
			...post,
			blocks: this.getPrismaJsonValue<PostBlockList>(post.blocks)
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

	// #region Misc Methods
	async getDashboardDetailsAsync(): Promise<DashboardDetails>
	{
		const twelveMonthsAgo = DateTime.utc().minus({ months: 12 }).toMillis()

		const dateFilter = {
			date: {
				gte: twelveMonthsAgo
			}
		}

		const projectCountPromise = this.prisma.project.count()

		const postCountPromise = this.prisma.post.groupBy({
			by: ['status'],
			_count: {
				id: true
			},
			where: {
				...dateFilter
			}
		})

		const dataFileCountPromise = this.prisma.file.groupBy({
			by: ['hasThumbnail'],
			_count: {
				id: true
			},
			where: {
				...dateFilter
			}
		})

		const postDatesPromise = this.prisma.post.findMany({
			orderBy: {
				date: 'desc'
			},
			select: {
				date: true,
			},
			where: {
				...dateFilter
			}
		})

		const [
			projectCount,
			postCount,
			dataFileCount,
			postDates
		] = await Promise.all([
			projectCountPromise,
			postCountPromise,
			dataFileCountPromise,
			postDatesPromise
		])

		return {
			counts: {
				projectsCountTotal: projectCount,
				postsCountTotal: postCount.reduce((sum, x) => sum + x._count.id, 0),
				postsCountActive: postCount.find(x => x.status === 'ACTIVE')?._count.id ?? 0,
				postsCountHidden: postCount.find(x => x.status === 'HIDDEN')?._count.id ?? 0,
				postsCountDisabled: postCount.find(x => x.status === 'DISABLED')?._count.id ?? 0,
				dataFilesCountTotal: dataFileCount.reduce((sum, x) => sum + x._count.id, 0),
				dataFilesCountWithThumbnail: dataFileCount.find(x => x.hasThumbnail === true)?._count.id ?? 0,
			},
			postDatesUnix: postDates.map(x => x.date)
		}
	}
	// #endregion
}
