import { Lemon } from 'next/font/google'

export const lemonFont = Lemon({
	weight: ['400'],
	subsets: ['latin'],
	display: 'swap',
	fallback: ['Helvetica', 'Arial', 'sans-serif'],
})
