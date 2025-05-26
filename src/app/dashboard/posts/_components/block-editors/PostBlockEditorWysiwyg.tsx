import { PostBlockEditorBaseProps } from '@/app/dashboard/posts/_components/block-editors/PostBlockEditorTypes'
import { useMemo } from 'react'

import { Box } from '@mui/material'
import dynamic from 'next/dynamic'
const JoditEditor = dynamic(() => import('jodit-react'), {
	ssr: false,
})

export function PostBlockEditorWysiwyg({ data, onDataChange }: PostBlockEditorBaseProps)
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
		<Box paddingTop={1}>
			<JoditEditor
				value={data.content ?? ''}
				config={config}
				onChange={(newContent) => onDataChange({ ...data, content: newContent })}
			/>
		</Box>
	)
}
