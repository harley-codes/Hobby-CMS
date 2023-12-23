
export interface DatabaseClient {
	getProjectListAsync(): Promise<ProjectListItem[]>;
}
