import { PostBlockList } from '@/modules/database/models'
import { NewDataFile, PostUpdateDetailsValues, ProjectUpdateValues } from '@/modules/database/requestTypes'
import { AccessTokenDetail, DataFileDetails, DataFilesPaginatedResponse, PostBlockDetails, PostDetail, ProjectDetail, ProjectListDetail } from '@/modules/database/responseTypes'

export interface DatabaseClient
{
	// Project
	getProjectDetailsAsync(): Promise<ProjectDetail[]>
	getProjectListDetailsAsync(): Promise<ProjectListDetail[]>
	createProjectAsync(name: string, isActive: boolean): Promise<ProjectDetail>
	deleteProjectAsync(projectId: string): Promise<void>
	updateProjectAsync(projectId: string, values: ProjectUpdateValues): Promise<ProjectDetail>

	// Token
	createAccessTokenAsync(projectId: string): Promise<AccessTokenDetail>
	deleteAccessTokenAsync(tokenId: string): Promise<void>

	// DataFile
	getDataFileDetailsAsync(fileId: string): Promise<DataFileDetails>
	getDataFileDataAsync(fileId: string): Promise<string>
	getDataFileThumbnailAsync(fileId: string): Promise<string>
	createDataFileAsync(file: NewDataFile): Promise<DataFileDetails>
	deleteDataFileAsync(fileId: string): Promise<void>
	getDataFilesPaginatedAsync(skip: number, take: number): Promise<DataFilesPaginatedResponse>

	// Posts
	getPostsDetailsAsync(projectId?: string): Promise<PostDetail[]>
	getPostBlocksAsync(postId: string): Promise<PostBlockDetails>
	createPostAsync(title: string, projectId: string): Promise<PostDetail>
	deletePostAsync(postId: string): Promise<void>
	updatePostDetailsAsync(postId: string, values: PostUpdateDetailsValues): Promise<PostDetail>
	updatePostBlocksAsync(postId: string, values: PostBlockList): Promise<PostBlockDetails>
}
