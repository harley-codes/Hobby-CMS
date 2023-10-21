import { RequireSessionWrapper } from '@/modules/auth/RequireSessionWrapper'

export default function Layout(props: ChildProps)
{
	return (
		<RequireSessionWrapper>
			{props.children}
		</RequireSessionWrapper>
	)
}
