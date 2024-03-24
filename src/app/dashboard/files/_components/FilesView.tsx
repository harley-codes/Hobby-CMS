'use client'

import { createDataFileServerAction, getDataFilesPaginatedServerAction } from '@/app/dashboard/_actions/fileActions'
import { FileListItem } from '@/app/dashboard/files/_components/FileListItem'
import { NewFileDialog } from '@/app/dashboard/files/_components/NewFileDialog'
import { invokeLoadingModal } from '@/components/LoadingModal'
import { NewDataFile } from '@/modules/database/requestTypes'
import { DataFileSearchItem, DataFilesPaginatedResponse } from '@/modules/database/responseTypes'
import { Box, Grid, Pagination } from '@mui/material'
import { useState } from 'react'

export function FilesView(props: DataFilesPaginatedResponse)
{
	const [page, setPage] = useState(1)
	const [pagination, setPagination] = useState(props.request)
	const [totalFiles, setTotalFiles] = useState(props.totalFiles)
	const [dataFilesSearches, setDataFilesSearches] = useState<Record<number, DataFileSearchItem[]>>({ 1: props.fileDetails })

	async function fileUploadHandler(fileData: NewDataFile)
	{
		const invokeLoading = (display: boolean) => invokeLoadingModal({ display, textOverride: 'Uploading Image' })

		invokeLoading(true)

		await createDataFileServerAction(fileData)
		await resetPagination()

		invokeLoading(false)
	}

	async function resetPagination()
	{
		const files = await getDataFilesPaginatedServerAction(0, process.env.PAGINATION_PAGE_SIZE)
		setDataFilesSearches({ 1: files.fileDetails })
		setTotalFiles(files.totalFiles)
		setPagination(files.request)
	}

	async function paginationHandler(_event: React.ChangeEvent<unknown>, value: number)
	{
		if (dataFilesSearches[value])
		{
			setPage(value)
			return
		}

		const invokeLoading = (display: boolean) => invokeLoadingModal({ display, textOverride: 'Loading' })

		invokeLoading(true)
		{
			// BUG: Review pagination issue - need to remove images before I can test
			throw new Error('NEEDS WORK')
			const result = await getDataFilesPaginatedServerAction((value - 1) * pagination.take, pagination.take)
			const newDataFilesSearches = { ...dataFilesSearches }
			newDataFilesSearches[value] = result.fileDetails
			setDataFilesSearches(newDataFilesSearches)
		}
		invokeLoading(false)
		setPage(value)
	}

	return (
		<>
			<Grid container spacing={2} paddingRight={4}>
				{dataFilesSearches[page].map((file) => (
					<Grid item key={file.id} xs={6} sm={4} md={3}>
						<FileListItem data={file} onClick={() => { }} />
					</Grid>
				))}
			</Grid>
			<Box height="1em" />
			<Box sx={{
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				display: 'flex',
				justifyContent: 'center',
				paddingTop: 1,
				paddingBottom: 1,
				zIndex: 1000,
				bgcolor: 'white',
				boxShadow: '0px 0px 3px 5px white',
			}}>
				<Pagination
					showFirstButton showLastButton
					count={Math.ceil(totalFiles / pagination.take)}
					shape="rounded"
					onChange={paginationHandler}
				/>
			</Box>
			<NewFileDialog onFileUpload={fileUploadHandler} />
		</>
	)
}
