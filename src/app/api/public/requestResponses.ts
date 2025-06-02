const defaultHeaders = {
	'Content-Type': 'application/json'
}

function createNotFoundResponse(message: string = 'not found'): Response
{
	return new Response(JSON.stringify({ error: message }), {
		status: 404,
		headers: defaultHeaders
	})
}

function createUnauthorizedResponse(message: string = 'unauthorized'): Response
{
	return new Response(JSON.stringify({ error: message }), {
		status: 401,
		headers: defaultHeaders
	})
}

function createSuccessResponse(data: object): Response
{
	return new Response(JSON.stringify(data), {
		status: 200,
		headers: defaultHeaders
	})
}

export const RequestResponses = {
	createNotFoundResponse,
	createUnauthorizedResponse,
	createSuccessResponse
}
