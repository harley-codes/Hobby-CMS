'use client'

import { createDataFileServerAction } from '@/app/dashboard/_actions/fileActions'
import { NewFileDialog } from '@/app/dashboard/files/_components/NewFileDialog'
import { invokeLoadingModal } from '@/components/LoadingModal'
import { NewDataFile } from '@/modules/database/requestTypes'

export function FilesView()
{
	async function fileUploadHandler(fileData: NewDataFile)
	{
		const invokeLoading = (display: boolean) => invokeLoadingModal({ display, textOverride: 'Uploading Image' })

		invokeLoading(true)

		const newFile = await createDataFileServerAction(fileData)

		console.log('New file created:', newFile)
		//set state

		invokeLoading(false)
	}

	return (
		<>
			<NewFileDialog onFileUpload={fileUploadHandler} />
		</>
	)
}
