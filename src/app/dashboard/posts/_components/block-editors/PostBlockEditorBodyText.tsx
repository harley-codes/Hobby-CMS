import { PostBlockEditorBaseProps } from '@/app/dashboard/posts/_components/block-editors/PostBlockEditorTypes'
import { TextField } from '@mui/material'

export function PostBlockEditorBodyText({ data, onDataChange }: PostBlockEditorBaseProps)
{
	return (
		<TextField
			margin='dense'
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
