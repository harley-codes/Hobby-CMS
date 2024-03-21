import { DataFileModel, ProjectModel } from '@/modules/database/models'

export type ProjectUpdateValues = {
	[K in keyof Pick<ProjectModel, 'name' | 'active' | 'meta'>]?: ProjectModel[K]
};

export type NewDataFile = Pick<DataFileModel,
	'name' |
	'fileMimeType' |
	'fileExtension' |
	'fileSizeKb' |
	'data64' |
	'thumbnail64' |
	'hasThumbnail'
>
