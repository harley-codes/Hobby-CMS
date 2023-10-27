import AppMenu from '@/app/dashboard/AppMenu'
import { RequireSessionWrapper } from '@/modules/auth/RequireSessionWrapper'

export default function Layout(props: ChildProps)
{
	return (
		<RequireSessionWrapper>
			<AppMenu />
			<main>
				{props.children}
			</main>
		</RequireSessionWrapper>
	)
}
