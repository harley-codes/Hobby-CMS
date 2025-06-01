import { PostBlockEditorBaseProps } from '@/app/dashboard/posts/_components/block-editors/PostBlockEditorTypes'
import { InputAdornment, MenuItem, Select, Stack, TextField } from '@mui/material'

export function PostBlockEditorHeaderText({ data, onDataChange }: PostBlockEditorBaseProps)
{
	return (
		<Stack spacing={2}>
			<TextField
				value={data.content ?? ''}
				onChange={(e) => onDataChange({ ...data, content: e.target.value })}
				slotProps={{
					htmlInput: {
						maxLength: 200,
					},
					input: {
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
					}
				}}
			/>
		</Stack>
	)
}
