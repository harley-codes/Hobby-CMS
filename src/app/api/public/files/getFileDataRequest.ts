import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'
import { getMimeType } from '@/modules/utility/imageCalculator'

export async function getFileData(fileId: string, overrideThumbnail: boolean): Promise<Response>
{
	const client = await getDatabaseClientAsync()
	const dataUrl = overrideThumbnail
		? await client.getDataFileThumbnailAsync(fileId)
		: await client.getDataFileDataAsync(fileId)

	const base64Data = dataUrl.split(';base64,').pop()!
	const imageBuffer = Buffer.from(base64Data, 'base64')

	const response = new Response(imageBuffer, {
		headers: {
			'content-type': getMimeType(dataUrl) ?? 'text/plain',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	})

	return response
}
