import { RequestResponses } from '@/app/api/public/requestResponses'
import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'
import { type NextRequest } from 'next/server'


export async function GET(request: NextRequest, { params }: { params: { accessToken: string, postId: string } })
{
	if (!params.accessToken)
		return RequestResponses.createUnauthorizedResponse('Access token is required to access this resource.')

	const queryParams = {
		includeBlocks: request.nextUrl.searchParams.get('includeBlocks') === 'true',
		showHidden: request.nextUrl.searchParams.get('showHidden') === 'true'
	}

	const client = await getDatabaseClientAsync()

	const post = await client.getPostDetailsPublicAsync(params.accessToken, params.postId, queryParams.includeBlocks, queryParams.showHidden)

	if (!post)
		return RequestResponses.createNotFoundResponse('No posts found for the given access token and/or postId.')

	return RequestResponses.createSuccessResponse(post)
}
