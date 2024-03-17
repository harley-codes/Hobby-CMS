import { AccessTokenModel, ProjectModel } from '@/modules/database/models'

export type ProjectDetail = Pick<ProjectModel, 'id' | 'name' | 'active' | 'meta'> & {
	accessTokens: Pick<AccessTokenModel, 'id' | 'token'>[];
};

export type AccessTokenDetail = Pick<AccessTokenModel, 'id' | 'token' | 'idProject'>;