import { fetchOpenGraphDataViaRegex } from '@/app/dashboard/_actions/openGraphLinkScrapeAction'
import { PostBlockEditorBaseProps } from '@/app/dashboard/posts/_components/block-editors/PostBlockEditorTypes'
import { invokeLoadingModal } from '@/components/LoadingModal'
import { invokeMessageAlertModal } from '@/components/MessageAlertModal'
import { Sync as SyncIcon, Visibility as VisibilityIcon } from '@mui/icons-material'
import { IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import { useState } from 'react'

export function PostBlockEditorOpenGraphLink({ data, onDataChange }: PostBlockEditorBaseProps)
{
	const url = data.url as string | undefined
	const content = data.content || {} as Record<string, string>

	const [previewData, setPreviewData] = useState(false)

	function togglePreviewHandler()
	{
		setPreviewData(!previewData)
	}

	async function urlUpdateHandler()
	{
		if (!url) return
		const invokeLoading = (display: boolean) => invokeLoadingModal({ display, textOverride: 'Scraping Data' })
		invokeLoading(true)
		const result = await fetchOpenGraphDataViaRegex(url)
		invokeLoading(false)
		if (result === false)
		{
			invokeMessageAlertModal({
				title: 'Failed to Fetch Data',
				description: 'Either url provided was invalid or there was a server error.',
			})
		}
		onDataChange({ ...data, content: result === false ? {} : result })
		setPreviewData(true)
	}

	return (
		<Stack spacing={1} paddingTop={2}>
			<Stack direction="row" spacing={2}>
				<TextField
					label='URL'
					fullWidth
					value={url ?? ''}
					size='small'
					onChange={(e) => onDataChange({ ...data, url: e.target.value })}
				/>
				<IconButton onClick={urlUpdateHandler} disabled={!url} title='Fetch Open Graph Data'>
					<SyncIcon />
				</IconButton>
				<IconButton onClick={togglePreviewHandler} disabled={!url} title='View Data'>
					{previewData ? <VisibilityIcon /> : <VisibilityIcon />}
				</IconButton>
			</Stack>
			<TableContainer hidden={!previewData}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell>Key</TableCell>
							<TableCell>Value</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Object.entries(content).map(([key, value]) => (
							<TableRow key={key}>
								<TableCell sx={{ verticalAlign: 'top' }}>{key.toUpperCase()}</TableCell>
								<TableCell>{!['url', 'image'].includes(key)
									? value
									: <a href={value} target='_blank'>{value}</a>
								}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	)
}
