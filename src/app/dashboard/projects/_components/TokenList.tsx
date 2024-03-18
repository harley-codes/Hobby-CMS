import { AccessTokenModel } from '@/modules/database/models'
import
{
	ContentCopy as ContentCopyIcon,
	Delete as DeleteIcon
} from '@mui/icons-material'
import { Button, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

type Props = {
	accessTokens: Pick<AccessTokenModel, 'id' | 'token'>[]
	createToken: () => void
	deleteToken: (tokenId: string) => void
}

export function TokenList(props: Props)
{
	const { accessTokens, createToken, deleteToken } = props

	return (
		<TableContainer component={Paper}>
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell>Tokens</TableCell>
						<TableCell align="right">
							<Button
								size="small" color="success"
								onClick={createToken}
							>Create New Token</Button>
						</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{accessTokens.map((token) => (
						<TableRow key={token.id}>
							<TableCell>
								<Stack
									gap={1} direction="row"
									sx={{
										cursor: 'pointer',
										'&:hover > button': {
											visibility: 'visible'
										}
									}}
								>
									<Typography variant="button">
										{
											token.token.slice(0, 4) +
											'.'.repeat(token.token.length - 8) +
											token.token.slice(-4)
										}
									</Typography>
									<IconButton
										size="small" sx={{ visibility: 'hidden' }}
										onClick={() => navigator.clipboard.writeText(token.token)}
									>
										<ContentCopyIcon fontSize="inherit" />
									</IconButton>
								</Stack>
							</TableCell>
							<TableCell align="right">
								<IconButton
									size="small"
									onClick={() => deleteToken(token.id)}>
									<DeleteIcon fontSize="inherit" />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
