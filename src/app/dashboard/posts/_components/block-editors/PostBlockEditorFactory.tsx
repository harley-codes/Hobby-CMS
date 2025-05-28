'use client'

import { PostBlockEditorBodyText } from '@/app/dashboard/posts/_components/block-editors/PostBlockEditorBodyText'
import { PostBlockEditorHeaderText } from '@/app/dashboard/posts/_components/block-editors/PostBlockEditorHeaderText'
import { PostBlockEditorImages } from '@/app/dashboard/posts/_components/block-editors/PostBlockEditorImages'
import { PostBlockEditorOpenGraphLink } from '@/app/dashboard/posts/_components/block-editors/PostBlockEditorOpenGraphLink'
import { PostBlockEditorSpacer } from '@/app/dashboard/posts/_components/block-editors/PostBlockEditorSpacer'
import { PostBlockEditorBaseProps, PostBlockTypes, PostBlockTypesArray } from '@/app/dashboard/posts/_components/block-editors/PostBlockEditorTypes'
import { PostBlockEditorWysiwyg } from '@/app/dashboard/posts/_components/block-editors/PostBlockEditorWysiwyg'
import { PostBlockListItem } from '@/modules/database/models'
import { v4 as CreateUID } from 'uuid'

export namespace BlockEditorFactory
{
	export function CreateEditorElement(componentProps: PostBlockEditorBaseProps, componentType: string): JSX.Element
	{
		const blockType = PostBlockTypesArray.find(x => x == componentType)
		if (typeof blockType === 'undefined')
			return <div>Error: {componentType} is not a valid block type.</div>

		switch (blockType)
		{
			case PostBlockTypes.RichText:
				return <PostBlockEditorWysiwyg data={componentProps.data} onDataChange={componentProps.onDataChange} />
			case PostBlockTypes.HeaderText:
				return <PostBlockEditorHeaderText data={componentProps.data} onDataChange={componentProps.onDataChange} />
			case PostBlockTypes.BodyText:
				return <PostBlockEditorBodyText data={componentProps.data} onDataChange={componentProps.onDataChange} />
			case PostBlockTypes.Images:
				return <PostBlockEditorImages data={componentProps.data} onDataChange={componentProps.onDataChange} />
			case PostBlockTypes.Spacer:
				return <PostBlockEditorSpacer data={componentProps.data} onDataChange={componentProps.onDataChange} />
			case PostBlockTypes.OpenGraphLink:
				return <PostBlockEditorOpenGraphLink data={componentProps.data} onDataChange={componentProps.onDataChange} />
			default:
				return <div>Error: {componentType} has not yet been configured.</div>
		}
	}

	export function CreateBlockBaseData(newBlockType: PostBlockTypes): PostBlockListItem
	{
		console.log('Creating new block of type:', newBlockType)

		const newBlock = {
			id: CreateUID(),
			type: newBlockType,
			meta: {},
		} as PostBlockListItem

		switch (newBlockType)
		{
			case PostBlockTypes.RichText:
				newBlock.content = ''
				break
			case PostBlockTypes.HeaderText:
				newBlock.content = ''
				newBlock.format = 'h4'
				break
			case PostBlockTypes.BodyText:
				newBlock.content = ''
				break
			case PostBlockTypes.Images:
				newBlock.images = []
				newBlock.display = 'single'
				break
			case PostBlockTypes.Spacer:
				newBlock.count = 1
				break
			case PostBlockTypes.OpenGraphLink:
				newBlock.maxDescriptionLength = 200
				newBlock.maxTitleLength = 100
				newBlock.url = ''
				newBlock.image = ''
				newBlock.title = ''
				newBlock.description = ''
				break
			default:
				throw new Error('Cannot create block, type not configured')
		}

		return newBlock
	}
}

