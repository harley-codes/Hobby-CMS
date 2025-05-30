'use client'

import { createPostServerAction, deletePostServerAction, getPostContentServerAction, updatePostBlocksServerAction, updatePostServerAction } from '@/app/dashboard/_actions/postActions'
import { CreatePostDialog } from '@/app/dashboard/posts/_components/CreatePostDialog'
import { PostContentEditDialog, invokePostContentEditRequest } from '@/app/dashboard/posts/_components/PostContentEditDialog'
import { PostListItem } from '@/app/dashboard/posts/_components/PostListItem'
import { invokeConfirmationModal } from '@/components/ConfirmationModal'
import { invokeLoadingModal } from '@/components/LoadingModal'
import { PostBlockList } from '@/modules/database/models'
import { PostUpdateDetailsValues } from '@/modules/database/requestTypes'
import { PostDetail, ProjectReferenceDetail } from '@/modules/database/responseTypes'
import { useCallback, useMemo, useState } from 'react'

type Props = {
	posts: PostDetail[]
	projects: ProjectReferenceDetail[]
}

export function PostsListView(props: Props)
{
	const [posts, setPosts] = useState(props.posts)
	const [activePost, setActivePost] = useState<PostDetail | undefined>(posts[0])

	const postNames = posts.map(x => x.title)

	const hasActivePostDetailsChanged = useMemo(() =>
	{
		if (!activePost) return false

		const originalPost = posts.find(x => x.id === activePost.id)
		if (!originalPost) return false

		const details = (post: PostDetail) => JSON.stringify({
			title: post.title,
			description: post.description,
			featuredImageURL: post.featuredImageURL,
			date: post.date,
			meta: post.meta,
			tags: post.tags,
			status: post.status,
			// CHECK BEFORE COMMITTING
			projects: post.projects.map(p => ({ id: p.id }))
			// projects: props.projects.filter(p => post.projects.some(pr => pr.id === p.id))
		})

		return details(activePost) !== details(originalPost)
	}, [activePost, posts])

	const checkPostIsActive = useCallback((postId: string) => activePost?.id === postId, [activePost])

	function setActivePostHandler(postId: string)
	{
		if (postId === activePost?.id) return

		const post = posts.find(x => x.id === postId)
		if (post) setActivePost(post)
	}

	function updateActivePostHandler(values: PostUpdateDetailsValues)
	{
		if (!activePost) return

		const updatedPost = {
			...activePost,
			...values,
			projects: values.projects
				? props.projects.filter(x => values.projects?.some(p => p.id === x.id))
				: activePost.projects
		}

		setActivePost(updatedPost)
	}

	function discardActivePostChangesHandler()
	{
		invokeConfirmationModal({
			description: 'Are you sure you want to discard these changes?',
			onConfirmed: (confirmed) => confirmed && discard(),
		})

		function discard()
		{
			if (!activePost) return

			const originalPost = posts.find(x => x.id === activePost.id)
			if (!originalPost) return

			setActivePost(originalPost)
		}
	}

	async function createPostHandler(newName: string, projectIds: string[])
	{
		const invokeLoading = (display: boolean) => invokeLoadingModal({ display, textOverride: 'Creating Post' })

		invokeLoading(true)
		{
			const newPost = await createPostServerAction(newName, projectIds)
			setPosts([newPost, ...posts])
			setActivePost(newPost)
		}
		invokeLoading(false)

		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	async function saveActivePostHandler()
	{
		if (!activePost) return

		invokeConfirmationModal({
			description: 'Are you sure you want to save changes to this post?',
			onConfirmed: (confirmed) => confirmed && save(),
		})

		const invokeLoading = (display: boolean) => invokeLoadingModal({ display, textOverride: 'Saving Post' })

		const save = async () =>
		{
			invokeLoading(true)

			const updatedPost = await updatePostServerAction(activePost.id, {
				title: activePost.title,
				description: activePost.description,
				featuredImageURL: activePost.featuredImageURL,
				date: activePost.date,
				meta: activePost.meta,
				tags: activePost.tags,
				status: activePost.status,
				projects: activePost.projects.map(p => ({ id: p.id })),
			})

			setPosts(posts.map(post =>
				post.id === activePost.id
					? updatedPost
					: post
			))

			invokeLoading(false)
		}
	}

	async function deleteActivePostHandler()
	{
		if (!activePost) return

		invokeConfirmationModal({
			description: 'Are you sure you want to delete this post?',
			onConfirmed: (confirmed) => confirmed && save(),
		})

		const invokeLoading = (display: boolean) => invokeLoadingModal({ display, textOverride: 'Deleting Post' })

		const save = async () =>
		{
			invokeLoading(true)
			{
				await deletePostServerAction(activePost.id)
				const updatedPostList = posts.filter(post => post.id !== activePost.id)
				setPosts(updatedPostList)
				setActivePost(updatedPostList[0] ?? undefined)
			}
			invokeLoading(false)
		}
	}

	async function loadContentRequestHandler()
	{
		if (!activePost) return

		const invokeLoading = (display: boolean) => invokeLoadingModal({ display, textOverride: 'Loading Content' })
		invokeLoading(true)
		{
			const content = await getPostContentServerAction(activePost.id)
			invokePostContentEditRequest({ postName: activePost.title, postBlocks: content.blocks })
		}
		invokeLoading(false)
	}

	async function savePostBlocksHandler(data: PostBlockList)
	{
		if (!activePost) return

		const invokeLoading = (display: boolean) => invokeLoadingModal({ display, textOverride: 'Saving Blocks' })
		invokeLoading(true)
		{
			await updatePostBlocksServerAction(activePost.id, data)
		}
		invokeLoading(false)
	}

	return (
		<div>
			{posts.map(post => (
				<PostListItem
					key={post.id}
					post={checkPostIsActive(post.id) ? activePost! : post}
					projectOptions={props.projects}
					expanded={checkPostIsActive(post.id)}
					detailsChangePending={checkPostIsActive(post.id) && hasActivePostDetailsChanged}
					updateDetail={updateActivePostHandler}
					savePost={saveActivePostHandler}
					deletePost={deleteActivePostHandler}
					discardChanges={discardActivePostChangesHandler}
					setActivePost={() => setActivePostHandler(post.id)}
					loadContentRequest={loadContentRequestHandler}
				/>
			))}

			<PostContentEditDialog onSave={savePostBlocksHandler} />
			<CreatePostDialog currentPostNames={postNames} projects={props.projects} onCreatePost={createPostHandler} />
		</div>
	)
}
