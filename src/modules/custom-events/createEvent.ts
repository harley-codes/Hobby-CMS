'use client'

import { useEffect, useRef } from 'react'

export function createEvent<T>(eventName: string)
{
	function callEvent(data: T)
	{
		const event = new CustomEvent(eventName, { detail: data })
		document.dispatchEvent(event)
	}

	function useEvent(callback: (data: T) => void)
	{
		const callbackRef = useRef(callback)

		useEffect(() =>
		{
			callbackRef.current = callback
		}, [callback])

		useEffect(() =>
		{

			function handleEvent(event: Event)
			{
				if (event instanceof CustomEvent && event.detail !== undefined)
				{
					callbackRef.current(event.detail)
				}
			}

			document.addEventListener(eventName, handleEvent)

			return () =>
			{
				document.removeEventListener(eventName, handleEvent)
			}
		}, [])
	}

	return { callEvent, useEvent } as const
}
