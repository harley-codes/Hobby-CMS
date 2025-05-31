import { DashboardDetails } from '@/app/dashboard/_components/DashboardDetails'
import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'
import { Stack, Typography } from '@mui/material'

async function getData()
{
	const client = await getDatabaseClientAsync()
	const dashboardDetails = await client.getDashboardDetailsAsync()
	return {
		dashboardDetails
	}
}

export default async function DashboardPage()
{
	const { dashboardDetails } = await getData()

	return (
		<Stack spacing={2}>
			<Typography variant="h4">Dashboard</Typography>
			<DashboardDetails {...dashboardDetails} />
		</Stack>
	)
}
