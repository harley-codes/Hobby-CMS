import { RequestResponses } from '@/app/api/public/requestResponses'
import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'

export async function GET(_request: Request, { params }: { params: { accessToken: string } })
{
	if (!params.accessToken)
		return RequestResponses.createUnauthorizedResponse('Access token is required to access this resource.')

	const client = await getDatabaseClientAsync()
	const project = await client.getProjectDetailsPublicAsync(params.accessToken)

	if (!project)
		return RequestResponses.createNotFoundResponse('Project not found. Either it is inactive, or invalid token used.')

	return RequestResponses.createSuccessResponse(project)
}
