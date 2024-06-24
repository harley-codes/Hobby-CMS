import { AccessTokenModel, FileModel, PostModel, ProjectModel } from '@/modules/database/models'

export type ProjectDetail = Pick<ProjectModel, 'id' | 'name' | 'active' | 'meta'> & {
	accessTokens: Pick<AccessTokenModel, 'id' | 'token'>[]
}

export type ProjectListDetail = Pick<ProjectModel, 'id' | 'name' | 'active'>

export type AccessTokenDetail = Pick<AccessTokenModel,
	'id' |
	'token' |
	'idProject'
>

export type DataFileDetails = Pick<FileModel,
	'id' |
	'name' |
	'mimeType' |
	'extension' |
	'date' |
	'sizeKb' |
	'meta' |
	'hasThumbnail'
>

export type DataFileSearchItem = Pick<DataFileDetails, 'id' | 'name' | 'hasThumbnail' | 'extension'>

export type DataFilesPaginatedResponse = {
	fileDetails: DataFileSearchItem[],
	totalFiles: number
	request: {
		skip: number,
		take: number
	}
}

export type PostDetail = Pick<PostModel,
	'id' |
	'title' |
	'description' |
	'featuredImageURL' |
	'date' |
	'meta' |
	'tags' |
	'status'
>

export type PostBlocks = Pick<PostModel, 'id' | 'blocks'>

export type PostUpdate = Pick<PostModel,
	'id' |
	'title' |
	'description' |
	'featuredImageURL' |
	'date' |
	'meta' |
	'tags' |
	'status'
>
