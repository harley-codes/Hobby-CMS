import { AccessTokenModel, FileModel, PostModel, ProjectModel } from '@/modules/database/models'

export type ProjectDetail = Pick<ProjectModel, 'id' | 'name' | 'active' | 'meta' | 'description' | 'featuredImageURL'> & {
	accessTokens: Pick<AccessTokenModel, 'id' | 'token'>[]
}

export type ProjectReferenceDetail = Pick<ProjectModel, 'id' | 'name' | 'active'>

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
> &
{
	projects: Pick<ProjectModel, 'id' | 'name' | 'active'>[]
}

export type PostBlockDetails = Pick<PostModel, 'id' | 'blocks'>

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
