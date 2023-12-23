'use client'

import { lemonFont } from '@/modules/fonts/lemonFont'
import MenuIcon from '@mui/icons-material/Menu'
import { Button, ButtonGroup, IconButton, Menu, MenuItem } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

const navLinks = [
	{ title: 'Dashboard', path: '/dashboard' },
	{ title: 'Projects', path: '/dashboard/projects' },
	{ title: 'Posts', path: '/dashboard/posts' },
	{ title: 'Images', path: '/dashboard/images' },
]

type MenuButtonProps = { title: string, path?: string, action?: () => void }
function MenuButton(props: MenuButtonProps)
{
	const { title, path, action } = props

	return (
		<Button
			href={path}
			onClick={action}
			variant='text'
			color='inherit'
			sx={{
				'&:hover': { color: 'warning.main' }
			}}
		> {title}</Button>
	)
}

export default function AppMenu()
{
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
	{
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () =>
	{
		setAnchorEl(null)
	}

	return (
		<AppBar position="relative">
			<Toolbar>
				<Typography variant="h6" pr={2} flexGrow={1} className={lemonFont.className}>
					Hobby CMS
				</Typography>
				{/* Large Display */}
				<Box display={{ xs: 'none', sm: 'initial' }}>
					<ButtonGroup>
						{navLinks.map((link) =>
							<MenuButton
								title={link.title}
								key={link.path}
								path={link.path}
							/>
						)}
						<MenuButton
							title="Logout"
							action={signOut}
						/>
					</ButtonGroup>
				</Box>

				{/* Small Display */}
				<Box display={{ xs: 'initial', sm: 'none' }}>
					<IconButton onClick={handleClick} color='inherit'>
						<MenuIcon />
					</IconButton>
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
					>
						{navLinks.map((link) =>
							<MenuItem
								key={link.path}
								href={link.path}
								component="a"
								onClick={handleClose}
							> {link.title}</MenuItem>
						)}
					</Menu>
				</Box>
			</Toolbar>
		</AppBar>
	)
}
