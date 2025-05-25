'use server'

import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'
import { PostBlockList } from '@/modules/database/models'
import { PostUpdateDetailsValues } from '@/modules/database/requestTypes'
import { PostBlockDetails, PostDetail } from '@/modules/database/responseTypes'

export async function createPostServerAction(postName: string, projectIds: string[]): Promise<PostDetail>
{
	const client = await getDatabaseClientAsync()
	const post = await client.createPostAsync(postName, projectIds)
	return post
}

export async function updatePostServerAction(postId: string, values: PostUpdateDetailsValues): Promise<PostDetail>
{
	const client = await getDatabaseClientAsync()
	const post = await client.updatePostDetailsAsync(postId, values)
	return post
}

export async function updatePostBlocksServerAction(postId: string, values: PostBlockList): Promise<PostBlockDetails>
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

export async function getPostContentServerAction(postId: string): Promise<PostBlockDetails>
{
	const client = await getDatabaseClientAsync()
	const blocks = await client.getPostBlocksAsync(postId)
	return blocks
}
