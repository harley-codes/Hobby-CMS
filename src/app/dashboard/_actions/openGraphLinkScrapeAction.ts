'use server'

export async function fetchOpenGraphDataViaRegex(url: string): Promise<Record<string, string> | false>
{
	try
	{
		const res = await fetch(url)
		const html = await res.text()
		const ogTagRegex = /<meta[^>]+property=["']og:([^"']+)["'][^>]+content=["']([^"']+)["'][^>]*>/gi

		const ogData: Record<string, string> = {}
		let match: RegExpExecArray | null

		while ((match = ogTagRegex.exec(html)) !== null)
		{
			const [, key, value] = match
			ogData[key.replace('og:', '')] = value
		}

		return ogData
	}
	catch (err)
	{
		return false
	}
}
