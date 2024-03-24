import { FilesView } from '@/app/dashboard/files/_components/FilesView'
import { NewFileButton } from '@/app/dashboard/files/_components/NewFileButton'
import { getDatabaseClientAsync } from '@/modules/database/databaseFactory'
import { Stack, Typography } from '@mui/material'

const getInitialFilesAsync = async () =>
{
	const client = await getDatabaseClientAsync()
	const files = await client.getDataFilesPaginatedAsync(0, Number(process.env.PAGINATION_PAGE_SIZE))
	return files
}

export default async function FileManagerPage()
{
	const files = await getInitialFilesAsync()

	return (
		<Stack spacing={2}>
			<Stack direction="row" justifyContent="space-between">
				<Typography variant="h4" component="header">File Manager</Typography>
				<NewFileButton />
			</Stack>
			<FilesView {...files} />
		</Stack>
	)
}
