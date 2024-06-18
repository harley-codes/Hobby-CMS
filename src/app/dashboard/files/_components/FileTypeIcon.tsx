import { FileExtension, fileExtensionMap } from '@/data/fileExtensions'
import { useMemo } from 'react'
import
{
	FaRegFile,
	FaRegFileAlt,
	FaRegFileArchive,
	FaRegFileAudio,
	FaRegFileExcel,
	FaRegFileImage,
	FaRegFilePdf,
	FaRegFilePowerpoint,
	FaRegFileVideo,
	FaRegFileWord
} from 'react-icons/fa'

type Props = {
	extension: string
}

export function FileTypeIcon(props: Props)
{
	const Icon = useMemo(() =>
	{
		const fileType = Object.keys(fileExtensionMap).find(
			(key) => fileExtensionMap[key as FileExtension].includes(props.extension)
		)

		switch (fileType)
		{
			case 'image':
				return <FaRegFileImage />
			case 'video':
				return <FaRegFileVideo />
			case 'audio':
				return <FaRegFileAudio />
			case 'pdf':
				return <FaRegFilePdf />
			case 'word':
				return <FaRegFileWord />
			case 'excel':
				return <FaRegFileExcel />
			case 'powerpoint':
				return <FaRegFilePowerpoint />
			case 'archive':
				return <FaRegFileArchive />
			case 'text':
				return <FaRegFileAlt />
			default:
				return <FaRegFile />
		}

	}, [props.extension])

	return <>{Icon}</>
}
