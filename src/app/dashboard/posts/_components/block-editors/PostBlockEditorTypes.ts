import { PostBlockListItem } from '@/modules/database/models'

export enum PostBlockTypes
{
	RichText = 'RichText',
	HeaderText = 'HeaderText',
	BodyText = 'BodyText',
	Images = 'Images'
}

export const PostBlockTypesArray: PostBlockTypes[] = [
	...Object.values(PostBlockTypes),
]

export interface PostBlockEditorBaseProps
{
	data: PostBlockListItem
	onDataChange: (newData: PostBlockListItem) => void
}
