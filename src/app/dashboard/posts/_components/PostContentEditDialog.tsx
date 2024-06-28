'use client'

import { BlockEditors } from '@/app/dashboard/posts/_components/PostBlockEditors'
import { SortingControls } from '@/app/dashboard/posts/_components/SortingControls'
import { invokeConfirmationModal } from '@/components/ConfirmationModal'
import { createEvent } from '@/modules/custom-events/createEvent'
import { PostBlockList, PostBlockListItem } from '@/modules/database/models'
import
{
	Add as AddIcon
} from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { v4 as CreateUID } from 'uuid'
type EventData = {
	postName: string
	postBlocks: PostBlockList
}

const showEvent = createEvent<EventData>('postContentEdit')

export const invokePostContentEditRequest = (data: EventData) => showEvent.callEvent(data)

const defaultState = {
	display: false,
	postName: '',
	postBlocks: [] as PostBlockList,
	process: false,
}

type Props = {
	onSave: (values: PostBlockList) => void
}

export function PostContentEditDialog(props: Props)
{
	const { onSave } = props

	const [state, setState] = useState(defaultState)

	const [newBlockType, setNewBlockType] = useState(BlockEditors.BlockTypes.RichText)

	const blockCount = Object.keys(state.postBlocks).length

	showEvent.useEvent((data: EventData) =>
	{
		setState({
			...defaultState,
			display: true,
			postName: data.postName,
			postBlocks: data.postBlocks,
		})
	})

	function cancelHandler()
	{
		setState({ ...state, display: false, process: false })
	}

	function exitHandler()
	{
		if (state.process)
		{
			onSave(state.postBlocks)
		}
		setState(defaultState)
	}

	function createStartHandler()
	{
		invokeConfirmationModal({
			description: 'Are you sure you want to save changes?',
			onConfirmed: (confirmed) =>
			{
				if (confirmed)
				{
					setState({ ...state, display: false, process: true })
				}
			}
		})
	}

	function onBlockAddHandler()
	{
		const newBlock = {} as PostBlockListItem
		const newId = CreateUID()
		switch (newBlockType)
		{
			case BlockEditors.BlockTypes.RichText:
				newBlock.id = newId
				newBlock.type = BlockEditors.BlockTypes.RichText
				newBlock.content = ''
				break
			case BlockEditors.BlockTypes.HeaderText:
				newBlock.id = newId
				newBlock.type = BlockEditors.BlockTypes.HeaderText
				newBlock.content = ''
				newBlock.format = 'h4'
				break
			case BlockEditors.BlockTypes.BodyText:
				newBlock.id = newId
				newBlock.type = BlockEditors.BlockTypes.BodyText
				newBlock.content = ''
				break
			default:
				throw new Error('Cannot add block, type not configured')
		}

		const newBlocks = [...state.postBlocks, newBlock]
		setState({ ...state, postBlocks: newBlocks })
	}

	function onBlockEditHandler(blockId: string, data: PostBlockListItem)
	{
		const newBlocks = state.postBlocks.map((block) => block.id === blockId ? data : block)
		setState({ ...state, postBlocks: newBlocks })
	}

	function checkBlockCanMove(blockId: string, position: 'top' | 'up' | 'down' | 'bottom'): boolean
	{
		const blockIndex = state.postBlocks.findIndex((block) => block.id === blockId)
		const blockCount = state.postBlocks.length

		if (position === 'top' || position === 'up') return blockIndex > 0
		if (position === 'down' || position === 'bottom') return blockIndex < blockCount - 1
		return false
	}

	function onMoveBlockHandler(blockId: string, position: 'top' | 'up' | 'down' | 'bottom')
	{
		if (!checkBlockCanMove(blockId, position)) return

		const blockIndex = state.postBlocks.findIndex((block) => block.id === blockId)
		const newBlocks = [...state.postBlocks]

		switch (position)
		{
			case 'top':
				newBlocks.splice(0, 0, newBlocks.splice(blockIndex, 1)[0])
				break
			case 'up':
				newBlocks.splice(blockIndex - 1, 0, newBlocks.splice(blockIndex, 1)[0])
				break
			case 'down':
				newBlocks.splice(blockIndex + 1, 0, newBlocks.splice(blockIndex, 1)[0])
				break
			case 'bottom':
				newBlocks.splice(newBlocks.length, 0, newBlocks.splice(blockIndex, 1)[0])
				break
		}

		setState({ ...state, postBlocks: newBlocks })
	}

	function onBlockDeleteHandler(blockId: string)
	{
		invokeConfirmationModal({
			description: 'Are you sure you want to delete this block?',
			onConfirmed: (confirmed) =>
			{
				if (!confirmed) return

				const blocks = state.postBlocks.filter((block) => block.id !== blockId)
				setState({ ...state, postBlocks: blocks })
			}
		})
	}

	return (
		<Dialog
			open={state.display}
			TransitionProps={{
				onExited: exitHandler,
			}}
			fullWidth maxWidth="lg"
			disableEnforceFocus
		>
			<DialogTitle>Post Content - {state.postName}</DialogTitle>
			<DialogContent>
				<Stack spacing={5}>
					<Stack spacing={2} direction="row" paddingTop={1}>
						<FormControl fullWidth size="small">
							<InputLabel>Add Block</InputLabel>
							<Select
								label="Add Block"
								value={newBlockType}
								onChange={(e) => setNewBlockType(e.target.value as BlockEditors.BlockTypes)}
							>
								{BlockEditors.BlockTypesArray.map((blockType) => (
									<MenuItem key={blockType} value={blockType}>{blockType.replace(/([A-Z][a-z])/g, ' $1').trim()}</MenuItem>
								))}
							</Select>
						</FormControl>
						<Button variant="outlined" endIcon={<AddIcon />} size='small' onClick={onBlockAddHandler}>
							Add
						</Button>
					</Stack>
					{blockCount === 0 && (
						<Typography variant="body1" color="textSecondary">
							No blocks have yet been added to this post.
						</Typography>
					)}
					{blockCount > 0 && (
						state.postBlocks.map((blockItem) => (
							<Stack key={blockItem.id} direction="column" gap={0.5}>
								<Box flexGrow={1}>
									{BlockEditors.CreateEditorElement({ data: { ...blockItem }, onDataChange: (e) => onBlockEditHandler(blockItem.id, e) }, blockItem.type)}
								</Box>
								<Box display="flex">
									<Box flexGrow={1}></Box>
									<SortingControls
										onMoveTop={() => onMoveBlockHandler(blockItem.id, 'top')}
										onMoveUp={() => onMoveBlockHandler(blockItem.id, 'up')}
										onDelete={() => onBlockDeleteHandler(blockItem.id)}
										onMoveDown={() => onMoveBlockHandler(blockItem.id, 'down')}
										onMoveBottom={() => onMoveBlockHandler(blockItem.id, 'bottom')}
										canMoveTop={checkBlockCanMove(blockItem.id, 'top')}
										canMoveUp={checkBlockCanMove(blockItem.id, 'up')}
										canMoveDown={checkBlockCanMove(blockItem.id, 'down')}
										canMoveBottom={checkBlockCanMove(blockItem.id, 'bottom')}
										size="small"
									/>
								</Box>
							</Stack>
						))
					)}
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={cancelHandler}>Cancel</Button>
				<Button onClick={createStartHandler}>Save Changes</Button>
			</DialogActions>
		</Dialog>
	)
}

