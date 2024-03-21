import { AccessTokenModel, DataFileModel, ProjectModel } from '@/modules/database/models'

export type ProjectDetail = Pick<ProjectModel, 'id' | 'name' | 'active' | 'meta'> & {
	accessTokens: Pick<AccessTokenModel, 'id' | 'token'>[];
};

export type AccessTokenDetail = Pick<AccessTokenModel,
	'id' |
	'token' |
	'idProject'
>;

export type DataFileDetails = Pick<DataFileModel,
	'id' |
	'name' |
	'fileMimeType' |
	'fileExtension' |
	'fileSizeKb' |
	'date' |
	'hasThumbnail'
>;
