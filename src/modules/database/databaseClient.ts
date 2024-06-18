import { NewDataFile, ProjectUpdateValues } from '@/modules/database/requestTypes'
import { AccessTokenDetail, DataFileDetails, DataFilesPaginatedResponse, ProjectDetail } from '@/modules/database/responseTypes'

export interface DatabaseClient {
	// Project
	getProjectsAsync(): Promise<ProjectDetail[]>;
	createProjectAsync(name: string, isActive: boolean): Promise<ProjectDetail>;
	deleteProjectAsync(projectId: string): Promise<void>;
	updateProjectAsync(projectId: string, values: ProjectUpdateValues): Promise<ProjectDetail>;

	// Token
	createAccessTokenAsync(projectId: string): Promise<AccessTokenDetail>;
	deleteAccessTokenAsync(tokenId: string): Promise<void>;

	// DataFile
	getDataFileDetailsAsync(fileId: string): Promise<DataFileDetails>;
	getDataFileDataAsync(fileId: string): Promise<string>;
	getDataFileThumbnailAsync(fileId: string): Promise<string>;
	createDataFileAsync(file: NewDataFile): Promise<DataFileDetails>;
	deleteDataFileAsync(fileId: string): Promise<void>;
	getDataFilesPaginatedAsync(skip: number, take: number): Promise<DataFilesPaginatedResponse>
}
