'use client'

import { invokeNewPostRequest } from '@/app/dashboard/posts/_components/CreatePostDialog'
import { Button } from '@mui/material'

export function CreatePostButton()
{
	return (
		<Button onClick={() => invokeNewPostRequest()}>Create Post</Button>
	)
}
