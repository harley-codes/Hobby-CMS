import { FileModel, ProjectModel } from '@/modules/database/models'

export type ProjectUpdateValues = {
	[K in keyof Pick<ProjectModel, 'name' | 'active' | 'meta'>]?: ProjectModel[K]
};

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
