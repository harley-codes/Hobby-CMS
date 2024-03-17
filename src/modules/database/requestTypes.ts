import { ProjectModel } from '@/modules/database/models'

export type ProjectUpdateValues = {
	[K in keyof Pick<ProjectModel, 'name' | 'active' | 'meta'>]?: ProjectModel[K]
};
