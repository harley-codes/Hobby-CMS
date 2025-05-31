'use client'

import { DashboardDetails } from '@/modules/database/responseTypes'
import { Card, CardContent, CardHeader, Grid, Stack } from '@mui/material'
import { LineChart, PieChart } from '@mui/x-charts'

const pieChartStyle = {
	startAngle: -90,
	endAngle: 90,
	paddingAngle: 5,
	innerRadius: 60,
	outerRadius: 80,
	cornerRadius: 4,
	cy: '75%',
}

function postDatesLastTwelveMonths(dates: bigint[])
{
	const currentDate = new Date()
	const lastTwelveMonths: {
		date: string,
		count: number
	}[] = []

	for (let i = 0; i < 12; i++)
	{
		const date = new Date(currentDate.getFullYear(), (currentDate.getMonth() + 1) - i, 1)
		lastTwelveMonths.push({
			date: date.toISOString().slice(0, 7), // Format as YYYY-MM
			count: 0
		})
	}

	dates.forEach((d) =>
	{
		const postDate = new Date(Number(d))
		const postYearMonth = postDate.toISOString().slice(0, 7) // Format as YYYY-MM
		const monthIndex = lastTwelveMonths.findIndex((m) => m.date === postYearMonth)
		if (monthIndex !== -1)
		{
			lastTwelveMonths[monthIndex].count += 1
		}
	})

	return lastTwelveMonths.reverse()
}

export function DashboardDetails(props: DashboardDetails)
{
	const { counts, postDatesUnix } = props

	const postDates = postDatesLastTwelveMonths(postDatesUnix)

	return (
		<Stack gap={2}>
			<Card>
				<CardHeader
					title="Projects"
					subheader={`${counts.projectsCountTotal} projects total.`}
				/>
			</Card>

			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<Card>
						<CardHeader
							title="File Breakdown"
							subheader={`${counts.dataFilesCountTotal} files uploaded in the past year.`}
						/>
						<CardContent>
							<PieChart
								series={[
									{
										...pieChartStyle,
										data: [
											{
												id: 'images',
												value: counts.dataFilesCountWithThumbnail,
												label: `Images: ${counts.dataFilesCountWithThumbnail}`
											},
											{
												id: 'other',
												value: counts.dataFilesCountTotal - counts.dataFilesCountWithThumbnail,
												label: `Other: ${counts.dataFilesCountTotal - counts.dataFilesCountWithThumbnail}`
											}
										]
									},
								]}
								height={200}
							/>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={6}>
					<Card>
						<CardHeader
							title="Post Breakdown"
							subheader={`${counts.postsCountTotal} posts total in the past year.`}
						/>
						<CardContent>
							<PieChart
								series={[
									{
										...pieChartStyle,
										data: [
											{
												id: 'total',
												value: counts.postsCountActive,
												label: `Active: ${counts.postsCountActive}`
											},
											{
												id: 'active',
												value: counts.postsCountHidden,
												label: `Hidden: ${counts.postsCountHidden}`
											},
											{
												id: 'hidden',
												value: counts.postsCountDisabled,
												label: `Disabled: ${counts.postsCountDisabled}`
											}
										]
									},
								]}
								height={200}
							/>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			<Card>
				<CardHeader
					title="Post Frequency"
					subheader="Including all post status types in the past year."
				/>
				<CardContent>
					<LineChart
						xAxis={[
							{
								data: postDates.map((date) =>
								{
									const [year, month] = date.date.split('-')
									return new Date(Number(year), Number(month) - 1).toLocaleString('en-US', { month: 'short' })
								}),
								scaleType: 'point',
							}
						]}
						yAxis={[
							{
								min: 0,
								max: Math.max(10, Math.max(...postDates.map(date => date.count)))
							}
						]}
						series={[
							{
								data: postDates.map((date) => date.count),
								area: true,
								baseline: 'min'
							},
						]}
						height={300}
						grid={{ vertical: true, horizontal: true }}
					/>
				</CardContent>
			</Card>
		</Stack>
	)
}
