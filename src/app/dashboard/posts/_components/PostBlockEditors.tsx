'use client'

import { PostBlockListItem } from '@/modules/database/models'
import { InputAdornment, MenuItem, Select, Stack, TextField } from '@mui/material'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
const JoditEditor = dynamic(() => import('jodit-react'), {
	ssr: false,
})

export namespace BlockEditors
{
	export enum BlockTypes
	{
		RichText = 'RichText',
		HeaderText = 'HeaderText',
		BodyText = 'BodyText'
	}

	export const BlockTypesArray: BlockTypes[] = [
		...Object.values(BlockTypes),
	]

	export interface Props
	{
		data: PostBlockListItem
		onDataChange: (newData: PostBlockListItem) => void
	}

	export function CreateEditorElement(componentProps: Props, componentType: string): JSX.Element
	{
		const blockType = BlockTypesArray.find(x => x == componentType)
		if (typeof blockType === 'undefined')
			return <div>Error: {componentType} is not a valid block type.</div>

		switch (blockType)
		{
			case BlockTypes.RichText:
				return <EditorWysiwyg data={componentProps.data} onDataChange={componentProps.onDataChange} />
			case BlockTypes.HeaderText:
				return <EditorHeaderText data={componentProps.data} onDataChange={componentProps.onDataChange} />
			case BlockTypes.BodyText:
				return <EditorBodyText data={componentProps.data} onDataChange={componentProps.onDataChange} />
			default:
				return <div>Error: {componentType} has not yet been configured.</div>
		}
	}

	function EditorBodyText({ data, onDataChange }: Props)
	{
		return (
			<TextField
				value={data.content ?? ''}
				onChange={(e) => onDataChange({ ...data, content: e.target.value })}
				multiline
				minRows={5}
				fullWidth
				sx={{
					'& .MuiOutlinedInput-notchedOutline': {
						borderRadius: 1
					}
				}}
			/>
		)
	}

	function EditorHeaderText({ data, onDataChange }: Props)
	{
		return (
			<Stack spacing={2}>
				<TextField
					value={data.content ?? ''}
					onChange={(e) => onDataChange({ ...data, content: e.target.value })}
					inputProps={{
						maxLength: 200,
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<Select
									value={data.format ?? 'h4'}
									onChange={(e) => onDataChange({ ...data, format: e.target.value })}
									displayEmpty
									variant="standard"
								>
									<MenuItem value="h1">H1</MenuItem>
									<MenuItem value="h2">H2</MenuItem>
									<MenuItem value="h3">H3</MenuItem>
									<MenuItem value="h4">H4</MenuItem>
									<MenuItem value="h5">H5</MenuItem>
									<MenuItem value="h6">H6</MenuItem>
								</Select>
							</InputAdornment>
						)
					}}
				/>
			</Stack>
		)
	}

	function EditorWysiwyg({ data, onDataChange }: Props)
	{
		const config = useMemo(() => ({
			readonly: false,
			placeholder: '',
			minHeight: 300,
			defaultFontSizePoints: 'pt',
			toolbarButtonSize: 'small' as 'small',
			hidePoweredByJodit: true,
			disablePlugins: [
				'video',
				'image',
				'file',
				'speechRecognize',
				'spellcheck',
				'fontsize',
				'copyformat',
				'classSpan',
				'print',
				'preview',
				'add-new-line',
			],
			buttons: [
				'undo', 'redo', '|',
				'bold',
				'italic',
				'underline',
				'strikethrough',
				'subscript',
				'superscript',
				'brush',
				'eraser', '|',
				'paragraph',
				'ul',
				'ol', '|',
				'left',
				'center',
				'right',
				'justify', '|',
				'outdent', 'indent', '|',
				'table',
				'link',
				'symbols',
				'hr', '|',
				'find', '|',
				'fullsize',
				'source',
			],
		}), [])

		return (
			<JoditEditor
				value={data.content ?? ''}
				config={config}
				onChange={(newContent) => onDataChange({ ...data, content: newContent })}
			/>
		)
	}
}

