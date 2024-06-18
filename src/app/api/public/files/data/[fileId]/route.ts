import { getFileData } from '@/app/api/public/files/getFileDataRequest'

export async function GET(_request: Request, { params }: { params: { fileId: string } })
{
	if (!params.fileId) throw new Error('No file ID provided')

	return await getFileData(params.fileId, false)
}
