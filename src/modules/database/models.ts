export type ProjectModel = {
	id: string;
	name: string;
	active: boolean;
	meta: Record<string, string>;
	posts: PostModel[];
	accessTokens: AccessTokenModel[];
};

export type AccessTokenModel = {
	id: string;
	idProject: string;
	token: string;
	project: ProjectModel | null;
}

export type PostModel = {
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
	project: ProjectModel | null;
}

export type PostStatus = 'ACTIVE' | 'DISABLED' | 'HIDDEN'
