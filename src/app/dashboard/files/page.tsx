import { FilesView } from '@/app/dashboard/files/_components/FilesView'
import { NewFileButton } from '@/app/dashboard/files/_components/NewFileButton'
import { Stack, Typography } from '@mui/material'

export default async function FileManagerPage()
{
	return (
		<Stack spacing={2}>
			<Stack direction="row" justifyContent="space-between">
				<Typography variant="h4" component="header">File Manager</Typography>
				<NewFileButton />
			</Stack>
			<FilesView />
		</Stack>
	)
}
