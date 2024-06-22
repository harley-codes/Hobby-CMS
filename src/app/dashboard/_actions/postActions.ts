'use server'

import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'
import { PostUpdateBlockValues, PostUpdateDetailsValues } from '@/modules/database/requestTypes'
import { PostBlocks, PostDetail } from '@/modules/database/responseTypes'

export async function createPostServerAction(postName: string, projectId: string): Promise<PostDetail>
{
	const client = await getDatabaseClientAsync()
	const post = await client.createPostAsync(postName, projectId)
	return post
}

export async function updatePostServerAction(postId: string, values: PostUpdateDetailsValues): Promise<PostDetail>
{
	const client = await getDatabaseClientAsync()
	const post = await client.updatePostDetailsAsync(postId, values)
	return post
}

export async function updatePostBlocksServerAction(postId: string, values: PostUpdateBlockValues): Promise<PostBlocks>
{
	const client = await getDatabaseClientAsync()
	const blocks = await client.updatePostBlocksAsync(postId, values)
	return blocks
}

export async function deletePostServerAction(postId: string): Promise<void>
{
	const client = await getDatabaseClientAsync()
	await client.deletePostAsync(postId)
}
