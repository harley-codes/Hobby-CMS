import { PostBlockEditorBaseProps } from '@/app/dashboard/posts/_components/block-editors/PostBlockEditorTypes'
import { Slider, Stack, Typography } from '@mui/material'

export function PostBlockEditorSpacer({ data, onDataChange }: PostBlockEditorBaseProps)
{
	const { count } = data

	return (
		<Stack direction='row' gap={2} paddingLeft={1} paddingRight={2} paddingTop={1}>
			<Typography variant='body1' minWidth='fit-content' sx={{ alignSelf: 'center' }}>
				Count: {count}
			</Typography>
			<Slider
				value={count}
				step={1}
				min={1}
				max={5}
				marks
				onChange={(e, newValue) => onDataChange({ ...data, count: newValue as number })}
			/>
		</Stack>
	)
}
