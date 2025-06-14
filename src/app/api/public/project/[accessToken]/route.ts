import { getHostFromRequestHeaders } from '@/app/api/public/getHostFromRequestHeaders'
import { RequestResponses } from '@/app/api/public/requestResponses'
import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ accessToken: string }> }
)
{
	const { accessToken } = await params

	if (!accessToken)
		return RequestResponses.createUnauthorizedResponse('Access token is required to access this resource.')

	const client = await getDatabaseClientAsync()
	const project = await client.getProjectDetailsPublicAsync(accessToken, getHostFromRequestHeaders(request.headers))

	if (!project)
		return RequestResponses.createNotFoundResponse('Project not found. Either it is inactive, or invalid token used.')

	return RequestResponses.createSuccessResponse(project)
}
