const defaultHeaders = {
	'Content-Type': 'application/json'
}

export namespace RequestResponses
{
	export function createNotFoundResponse(message: string = 'not found'): Response
	{
		return new Response(JSON.stringify({ error: message }), {
			status: 404,
			headers: defaultHeaders
		})
	}
	export function createUnauthorizedResponse(message: string = 'unauthorized'): Response
	{
		return new Response(JSON.stringify({ error: message }), {
			status: 401,
			headers: defaultHeaders
		})
	}
	export function createSuccessResponse(data: object): Response
	{
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: defaultHeaders
		})
	}
}
