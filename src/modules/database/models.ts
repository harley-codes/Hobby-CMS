type Project = {
	id: string;
	name: string;
	active: boolean;
	posts: Post[];
	accessTokens: AccessToken[];
};

type AccessToken = {
	id: string;
	idProject: string;
	token: string;
	project: Project | null;
}

type Post = {
	id: string;
	idProject: string;
	title: string;
	description: string;
	featuredImageURL: string;
	date: Date;
	blocks: Record<string, Record<string, string>>;
	meta: Record<string, string>;
	tags: string[];
	status: PostStatus;
	project: Project | null;
}

type PostStatus = 'ACTIVE' | 'DISABLED' | 'HIDDEN'

type ProjectListItem = Pick<Project, 'id' | 'name' | 'active'>;
