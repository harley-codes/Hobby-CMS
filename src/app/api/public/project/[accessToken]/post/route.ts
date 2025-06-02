import { getHostFromRequestHeaders } from '@/app/api/public/getHostFromRequestHeaders'
import { RequestResponses } from '@/app/api/public/requestResponses'
import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'
import { type NextRequest } from 'next/server'


export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ accessToken: string }> }
)
{
	const { accessToken } = await params

	if (!accessToken)
		return RequestResponses.createUnauthorizedResponse('Access token is required to access this resource.')

	const queryParams = {
		includeBlocks: request.nextUrl.searchParams.get('includeBlocks') === 'true',
		showHidden: request.nextUrl.searchParams.get('showHidden') === 'true',
		skip: parseInt(request.nextUrl.searchParams.get('skip') || '0', 10),
		take: parseInt(request.nextUrl.searchParams.get('take') || process.env.PAGINATION_PAGE_SIZE.toString(), 10)
	}

	const client = await getDatabaseClientAsync()

	const response = await client.getPostsDetailsPublicAsync(
		accessToken,
		getHostFromRequestHeaders(request.headers),
		queryParams.includeBlocks,
		queryParams.showHidden,
		queryParams.skip,
		queryParams.take
	)

	return RequestResponses.createSuccessResponse(response)
}
