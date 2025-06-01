export function getHostFromRequestHeaders(headers: Headers): string
{
	const forwardedFor = headers.get('x-forwarded-for')
	const realIp = headers.get('x-real-ip')
	const connectingIp = headers.get('cf-connecting-ip')

	return forwardedFor || realIp || connectingIp || ''
}
