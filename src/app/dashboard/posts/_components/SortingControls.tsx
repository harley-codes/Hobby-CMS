import
{
	DeleteForever as DeleteForeverIcon,
	KeyboardArrowDown as KeyboardArrowDownIcon,
	KeyboardArrowUp as KeyboardArrowUpIcon,
	KeyboardDoubleArrowDown as KeyboardDoubleArrowDownIcon,
	KeyboardDoubleArrowUp as KeyboardDoubleArrowUpIcon
} from '@mui/icons-material'
import { Box, IconButton, Stack } from '@mui/material'

type Props = {
	onMoveTop: () => void
	onMoveUp: () => void
	onDelete: () => void
	onMoveDown: () => void
	onMoveBottom: () => void
	canMoveTop: boolean
	canMoveUp: boolean
	canMoveDown: boolean
	canMoveBottom: boolean
	direction?: 'row' | 'column'
	size?: 'small' | 'medium' | 'large'
}

export function SortingControls(props: Props)
{
	const {
		onMoveTop,
		onMoveUp,
		onDelete,
		onMoveDown,
		onMoveBottom,
		canMoveTop,
		canMoveUp,
		canMoveDown,
		canMoveBottom,
		direction = 'row',
		size = 'medium'
	} = props

	const buttonMap = [
		{ onClick: onMoveTop, disabled: !canMoveTop, icon: KeyboardDoubleArrowUpIcon, tooltip: 'Move to top' },
		{ onClick: onMoveUp, disabled: !canMoveUp, icon: KeyboardArrowUpIcon, tooltip: 'Move up' },
		{ onClick: onDelete, disabled: false, icon: DeleteForeverIcon, tooltip: 'Delete' },
		{ onClick: onMoveDown, disabled: !canMoveDown, icon: KeyboardArrowDownIcon, tooltip: 'Move down' },
		{ onClick: onMoveBottom, disabled: !canMoveBottom, icon: KeyboardDoubleArrowDownIcon, tooltip: 'Move to bottom' },
	]

	return (
		<Box>
			<Stack gap={0.5} direction={direction}>
				{buttonMap.map((button, index) => (
					<IconButton key={index} onClick={button.onClick} disabled={button.disabled} title={button.tooltip} size={size}>
						<button.icon />
					</IconButton>
				))}
			</Stack>
		</Box>
	)
}
