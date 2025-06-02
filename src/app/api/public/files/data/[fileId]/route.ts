import { getFileData } from '@/app/api/public/files/getFileDataRequest'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ fileId: string }> }
)
{
	const { fileId } = await params

	if (!fileId) throw new Error('No file ID provided')

	return await getFileData(fileId, false)
}
