import { ProjectUpdateValues } from '@/modules/database/requestTypes'
import { AccessTokenDetail, ProjectDetail } from '@/modules/database/responseTypes'

export interface DatabaseClient {
	// Project
	getProjectsAsync(): Promise<ProjectDetail[]>;
	createProjectAsync(name: string, isActive: boolean): Promise<ProjectDetail>;
	deleteProjectAsync(projectId: string): Promise<void>;
	updateProjectAsync(projectId: string, values: ProjectUpdateValues): Promise<ProjectDetail>;

	// Token
	createAccessTokenAsync(projectId: string): Promise<AccessTokenDetail>;
	deleteAccessTokenAsync(tokenId: string): Promise<void>;
}
