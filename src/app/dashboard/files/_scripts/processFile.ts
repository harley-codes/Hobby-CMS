import { fileExtensionMap } from '@/data/fileExtensions'
import { NewDataFile } from '@/modules/database/requestTypes'
import { calculateAspectRatio, compressImageWithDataUrl, getImageResolution } from '@/modules/utility/imageCalculator'

type PartialFile = Pick<NewDataFile, 'name' | 'mimeType' | 'sizeKb' | 'data64'>

export async function processFile(file: PartialFile): Promise<NewDataFile>
{
	const extension = file.name.split('.').pop() ?? ''
	const isImage = fileExtensionMap['image'].includes(extension)
	const thumbnail64 = isImage
		? await compressImageWithDataUrl(file.data64, process.env.NEXT_PUBLIC_DATABASE_FILE_THUMBNAIL_MAX_SIZE_KB)
		: undefined

	const meta: Record<string, string> = {
		'file-size': `${file.sizeKb.toFixed(0)}kb`,
		'mime-type': file.mimeType
	}

	if (isImage)
	{
		const { width, height } = await getImageResolution(file.data64)
		meta['image-resolution'] = `${width}x${height}`
		meta['aspect-ratio'] = calculateAspectRatio(width, height)
		meta['thumbnail-quality'] = (1 / (file.data64.length / thumbnail64!.length)).toFixed(2)
	}

	return {
		...file,
		extension,
		meta,
		thumbnail64,
		hasThumbnail: isImage
	}
}
