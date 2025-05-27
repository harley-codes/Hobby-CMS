import { PostBlockListItem } from '@/modules/database/models'

export enum PostBlockTypes
{
	HeaderText = 'HeaderText',
	BodyText = 'BodyText',
	RichText = 'RichText',
	Images = 'Images',
	Spacer = 'Spacer',
}

export const PostBlockTypesArray: PostBlockTypes[] = [
	...Object.values(PostBlockTypes),
]

export interface PostBlockEditorBaseProps
{
	data: PostBlockListItem
	onDataChange: (newData: PostBlockListItem) => void
}
