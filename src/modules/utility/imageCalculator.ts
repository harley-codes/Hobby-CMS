export function calculateAspectRatio(width: number, height: number): string
{
	function gcd(a: number, b: number): number
	{
		return (b == 0) ? a : gcd(b, a % b)
	}

	const divisor = gcd(width, height)

	return (width / divisor) + ':' + (height / divisor)
}

export async function getImageResolution(dataUrl: string): Promise<{ width: number; height: number }>
{
	return new Promise((resolve, reject) =>
	{
		const image = new Image()
		image.onload = () => resolve({ width: image.width, height: image.height })
		image.onerror = (error) => reject(error)
		image.src = dataUrl
	})
};

export function getMimeType(dataUrl: string): string | null
{
	const match = dataUrl.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)
	return match ? match[1] : null
}

export async function compressImageWithDataUrl(dataUrl: string, targetKb: number): Promise<string>
{
	const targetBytes = targetKb * 1024
	const stepRate = process.env.NEXT_PUBLIC_IMAGE_COMPRESSION_STEP_RATE
	const mimeType = getMimeType(dataUrl) ?? 'image/jpeg'

	try
	{
		let currentQuality = 0.5 - stepRate
		let compressedUrl = dataUrl

		while (compressedUrl.length > targetBytes && currentQuality >= 0.1)
		{
			const image = new Image()
			image.src = compressedUrl

			await new Promise<void>((resolve) =>
			{
				image.onload = () =>
				{
					const canvas = document.createElement('canvas')
					const context = canvas.getContext('2d')

					if (!context)
					{
						resolve()
						return
					}

					const width = image.width
					const height = image.height

					canvas.width = width
					canvas.height = height

					context.drawImage(image, 0, 0, width, height)

					compressedUrl = canvas.toDataURL(mimeType, currentQuality)
					currentQuality -= stepRate

					resolve()
				}
			})
		}

		return compressedUrl
	}
	catch (e)
	{
		console.error(e)
		throw new Error('Failed to compress image')
	}

}

