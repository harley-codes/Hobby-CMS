import AppMenu from '@/app/dashboard/AppMenu'
import { RequireSessionWrapper } from '@/modules/auth/RequireSessionWrapper'
import { Container } from '@mui/material'

export default function Layout(props: ChildProps)
{
	return (
		<RequireSessionWrapper>
			<AppMenu />
			<Container maxWidth="lg" component="main">
				{props.children}
			</Container>
		</RequireSessionWrapper>
	)
}
