import { FileModel, PostModel, ProjectModel } from '@/modules/database/models'

export type ProjectUpdateValues = {
	[K in keyof Pick<ProjectModel,
		'name' | 'active' | 'meta' | 'description' | 'featuredImageURL'
	>]?: ProjectModel[K]
}

export type NewDataFile = Pick<FileModel,
	'name' |
	'mimeType' |
	'extension' |
	'sizeKb' |
	'meta' |
	'data64' |
	'thumbnail64' |
	'hasThumbnail'
>

export type PostUpdateDetailsValues = {
	[K in keyof Pick<PostModel,
		'title' |
		'description' |
		'featuredImageURL' |
		'date' |
		'meta' |
		'tags' |
		'status'
	>]?: PostModel[K]
} &
{
	projects?: Pick<ProjectModel, 'id'>[]
}

export type PostUpdateBlockValues = Pick<PostModel,
	'blocks'
>
