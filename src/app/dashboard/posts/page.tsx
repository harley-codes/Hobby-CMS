
import { CreatePostButton } from '@/app/dashboard/posts/_components/CreatePostButton'
import { PostsListView } from '@/app/dashboard/posts/_components/PostsListView'
import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'
import { Stack, Typography } from '@mui/material'

const getDataAsync = async () =>
{
	const client = await getDatabaseClientAsync()
	const [posts, projects] = await Promise.all([
		client.getPostsDetailsAsync(),
		client.getProjectDetailsAsync()
	])
	return { posts, projects }
}

export default async function PostsPage()
{
	const { posts, projects } = await getDataAsync()

	return (
		<Stack spacing={2}>
			<Stack direction="row" justifyContent="space-between">
				<Typography variant="h4" component="header">Posts</Typography>
				<CreatePostButton />
			</Stack>
			<PostsListView posts={posts} projects={projects} />
		</Stack>
	)
}
