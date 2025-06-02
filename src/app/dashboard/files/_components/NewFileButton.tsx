'use client'

import { invokeNewFileRequest } from '@/app/dashboard/files/_components/NewFileDialog'
import { processFile } from '@/app/dashboard/files/_scripts/processFile'
import { invokeMessageAlertModal } from '@/components/MessageAlertModal'
import { Button } from '@mui/material'
import { useRef, useState } from 'react'

export function NewFileButton()
{
	const [disableButton, setDisableButton] = useState(false)

	const fileInputRef = useRef<HTMLInputElement>(null)

	function clickHandler()
	{
		fileInputRef.current?.click()
	}

	function changeHandler(e: React.ChangeEvent<HTMLInputElement>)
	{
		const file = e.target.files?.[0]
		e.target.value = ''

		if (!file) return

		if (file.size / 1024 > process.env.NEXT_PUBLIC_DATABASE_FILE_DATA_MAX_SIZE_KB)
		{
			invokeMessageAlertModal({
				title: 'File Too Large',
				description: `The selected must be under ${process.env.NEXT_PUBLIC_DATABASE_FILE_DATA_MAX_SIZE_KB}kb.`,
			})
			return
		}

		setDisableButton(true)
		const reader = new FileReader()

		reader.addEventListener('load', async (event) =>
		{
			const base64 = event.target?.result as string
			if (!base64) return

			const fileDetail = await processFile({
				name: file.name,
				sizeKb: file.size / 1024,
				mimeType: file.type,
				data64: base64
			})

			invokeNewFileRequest(fileDetail)
			setDisableButton(false)
		})

		reader.readAsDataURL(file)
	}

	return (
		<section>
			<Button onClick={clickHandler} disabled={disableButton}>New File</Button>
			<input
				type="file"
				ref={fileInputRef}
				onChange={changeHandler}
				style={{ display: 'none' }}
			/>
		</section>
	)
}
