'use client'

import { robotoFont } from '@/modules/fonts/robotoFont'
import { createTheme } from '@mui/material'

export const materialTheme = createTheme({
	cssVariables: {
		colorSchemeSelector: 'class',
	},
	typography: {
		fontFamily: robotoFont.style.fontFamily,
	},
})
