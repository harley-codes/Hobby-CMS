type Project = {
	id: string;
	name: string;
	active: boolean;
	meta: Record<string, string>;
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

type ProjectDetail = Pick<Project, 'id' | 'name' | 'active' | 'meta'> & {
	accessTokens: Pick<AccessToken, 'id' | 'token'>[];
};
