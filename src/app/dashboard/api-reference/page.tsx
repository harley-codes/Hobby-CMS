import { ApiRequests } from '@/app/dashboard/api-reference/_components/apiRequests'
import { Stack, Typography } from '@mui/material'

export default function ApiReferencePage()
{
	return (
		<Stack spacing={2}>
			<Stack direction="row" justifyContent="space-between">
				<Typography variant="h4" component="header">API Reference</Typography>
			</Stack>
			<ApiRequests />
		</Stack>
	)
}
