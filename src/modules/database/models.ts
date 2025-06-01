
export type ProjectModel = {
	id: string
	name: string
	description: string | null
	featuredImageURL: string | null
	active: boolean
	meta: Record<string, string>
	posts: PostModel[]
	accessTokens: AccessTokenModel[]
}

export type AccessTokenModel = {
	id: string
	idProject: string
	token: string
	allowedHost: string
	project: ProjectModel | null
}

export type PostModel = {
	id: string
	idProject: string
	title: string
	description: string | null
	featuredImageURL: string | null
	date: Date
	blocks: PostBlockList
	meta: Record<string, string>
	tags: string[]
	status: PostStatus
	projects: ProjectModel[]
}

export type PostBlockList = PostBlockListItem[]
export type PostBlockListItem = {
	id: string
	type: string
	meta: Record<string, string>
} & Record<string, any>

export type PostStatus = 'ACTIVE' | 'DISABLED' | 'HIDDEN'

export type FileModel = {
	id: string
	name: string
	mimeType: string
	extension: string
	date: Date
	sizeKb: number
	meta: Record<string, string>
	data64: string
	hasThumbnail: boolean
	thumbnail64: string | undefined
}
