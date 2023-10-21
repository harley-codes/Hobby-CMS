import { LogoutButton } from '@/components/authDemo'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export default function Home()
{
	return (
		<main>
			<Container>
				<Box>
					<Card>
						<Typography variant="h2">Hello World ~ Signed In</Typography>
					</Card>
				</Box>
				<Box>
					<LogoutButton />
				</Box>
			</Container>
		</main>
	)
}
