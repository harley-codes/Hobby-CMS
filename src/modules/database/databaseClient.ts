
export interface DatabaseClient {
	getProjectListAsync(): Promise<ProjectDetail[]>;
	createProjectAsync(name: string): Promise<ProjectDetail>;
}
