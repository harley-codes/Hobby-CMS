'use client'

import { invokeLoadingModal } from '@/components/LoadingModal'
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const invokeLoading = (display: boolean) => invokeLoadingModal({ display, textOverride: 'Fetching API Response...' })

export function ApiRequests()
{
	const [token, setToken] = useState<string>('project-token-uuid')
	const [includeBlocks, setIncludeBlocks] = useState<boolean>(false)
	const [showHidden, setShowHidden] = useState<boolean>(false)
	const [skip, setSkip] = useState<number>(0)
	const [take, setTake] = useState<number>(3)
	const [postId, setPostId] = useState<string>('post-id-uuid')

	const [projectApiResponse, setProjectApiResponse] = useState<string | null>(null)
	const [postApiResponse, setPostApiResponse] = useState<string | null>(null)
	const [postsApiResponse, setPostsApiResponse] = useState<string | null>(null)

	const [host, setHost] = useState<string>('')

	useEffect(() =>
	{
		const currentHost = typeof window !== 'undefined' ? window.location.host : ''
		if (host !== currentHost)
		{
			setHost(currentHost)
		}
	}, [host])

	async function fetchProjectData()
	{
		setProjectApiResponse(null)
		invokeLoading(true)
		{
			try
			{
				const response = await fetch(`/api/public/project/${token}`)
				const data = await response.json()
				setProjectApiResponse(JSON.stringify(data, null, 2))
			}
			catch (error)
			{
				console.error('Error fetching data:', error)
				setProjectApiResponse('Error fetching data')
			}
		}
		invokeLoading(false)
	}

	async function fetchPostsData()
	{
		setPostsApiResponse(null)
		invokeLoading(true)
		{
			try
			{
				const response = await fetch(`/api/public/project/${token}/post?includeBlocks=${includeBlocks}&showHidden=${showHidden}&skip=${skip}&take=${take}`)
				const data = await response.json()
				setPostsApiResponse(JSON.stringify(data, null, 2))
			}
			catch (error)
			{
				console.error('Error fetching data:', error)
				setPostsApiResponse('Error fetching data')
			}
		}
		invokeLoading(false)
	}

	async function fetchPostData()
	{
		setPostApiResponse(null)
		invokeLoading(true)
		{
			try
			{
				const response = await fetch(`/api/public/project/${token}/post/${postId}?includeBlocks=${includeBlocks}`)
				const data = await response.json()
				setPostApiResponse(JSON.stringify(data, null, 2))
			}
			catch (error)
			{
				console.error('Error fetching data:', error)
				setPostApiResponse('Error fetching data')
			}
		}
		invokeLoading(false)
	}

	return (
		<Stack>
			<Accordion>
				<AccordionSummary>
					<Chip label="GET" color="success" size='small' sx={{ borderRadius: 1 }} />
					<Typography paddingLeft={1}>/api/public/project/[token]</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Stack spacing={1}>
						<Typography variant='h6'>
							Returns the project details for the given token.
						</Typography>
						<Typography>
							This can be useful for displaying a card that navigates to respective posts.
						</Typography>
						<Stack gap={2} boxShadow={1} padding={2}>
							<Stack direction="row" gap={1} alignItems='baseline'>
								<Typography>Request</Typography>
								<Typography variant='caption'>{host}/api/public/project/{token}</Typography>
							</Stack>
							<TextField
								label="Project Token"
								value={token}
								onChange={(e) => setToken(e.target.value)}
							/>
						</Stack>
						{projectApiResponse && (
							<Stack gap={2} boxShadow={1} padding={2}>
								<Typography>Response</Typography>
								<Box border={1} borderRadius={1} borderColor='grey.400' padding={2}>
									<pre style={{ maxHeight: '600px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
										<code>{projectApiResponse}</code>
									</pre>
								</Box>
							</Stack>
						)}
					</Stack>
				</AccordionDetails>
				<AccordionActions>
					<Button color='success' onClick={fetchProjectData}>Send Request</Button>
				</AccordionActions>
			</Accordion>
			<Accordion>
				<AccordionSummary>
					<Chip label="GET" color="success" size='small' sx={{ borderRadius: 1 }} />
					<Typography paddingLeft={1}>/api/public/project/[token]/post</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Stack spacing={1}>
						<Typography variant='h6'>
							Returns the posts details for the given token/project.
						</Typography>
						<Typography>
							Block data can be excluded for initial requests, were the content will not be displayed.
						</Typography>
						<Stack gap={2} boxShadow={1} padding={2}>
							<Stack direction="row" gap={1} alignItems='baseline'>
								<Typography>Request</Typography>
								<Typography variant='caption'>{host}/api/public/project/{token}/post?includeBlocks={`${includeBlocks}`}&showHidden={`${showHidden}`}&skip={skip}&take={take}</Typography>
							</Stack>
							<TextField
								label="Project Token"
								value={token}
								onChange={(e) => setToken(e.target.value)}
							/>
							<FormControl>
								<InputLabel>Show Hidden Posts</InputLabel>
								<Select label='Show Hidden Posts' value={showHidden} onChange={(e) => setShowHidden(e.target.value === 'true')}>
									<MenuItem value={'true'}>Yes</MenuItem>
									<MenuItem value={'false'}>No</MenuItem>
								</Select>
							</FormControl>
							<FormControl>
								<InputLabel>Include block data</InputLabel>
								<Select label='Include block data' value={includeBlocks} onChange={(e) => setIncludeBlocks(e.target.value === 'true')}>
									<MenuItem value={'true'}>Yes</MenuItem>
									<MenuItem value={'false'}>No</MenuItem>
								</Select>
							</FormControl>
							<TextField
								label="Skip"
								value={skip}
								type='number'
								onChange={(e) =>
								{
									const x = parseInt(e.target.value)
									if (Number.isFinite(x)) setSkip(x)
								}}
							/>
							<TextField
								label="Take"
								value={take}
								type='number'
								onChange={(e) =>
								{
									const x = parseInt(e.target.value)
									if (Number.isFinite(x)) setTake(x)
								}}
							/>
						</Stack>
						{postsApiResponse && (
							<Stack gap={2} boxShadow={1} padding={2}>
								<Typography>Response</Typography>
								<Box border={1} borderRadius={1} borderColor='grey.400' padding={2}>
									<pre style={{ maxHeight: '600px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
										<code>{postsApiResponse}</code>
									</pre>
								</Box>
							</Stack>
						)}
					</Stack>
				</AccordionDetails>
				<AccordionActions>
					<Button color='success' onClick={fetchPostsData}>Send Request</Button>
				</AccordionActions>
			</Accordion>
			<Accordion>
				<AccordionSummary>
					<Chip label="GET" color="success" size='small' sx={{ borderRadius: 1 }} />
					<Typography paddingLeft={1}>/api/public/project/[token]/post/[id]</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Stack spacing={1}>
						<Typography variant='h6'>
							Returns the post details for the given token/project.
						</Typography>
						<Typography>
							Request will match with both active and hidden posts. This is useful for when hiding posts from a feed, but still allowing access to the post itself.
						</Typography>
						<Stack gap={2} boxShadow={1} padding={2}>
							<Stack direction="row" gap={1} alignItems='baseline'>
								<Typography>Request</Typography>
								<Typography variant='caption'>{host}/api/public/project/{token}/post/{postId}?includeBlocks={`${includeBlocks}`}</Typography>
							</Stack>
							<TextField
								label="Project Token"
								value={token}
								onChange={(e) => setToken(e.target.value)}
							/>
							<TextField
								label="Post ID"
								value={postId}
								onChange={(e) => setPostId(e.target.value)}
							/>
							<FormControl>
								<InputLabel>Include block data</InputLabel>
								<Select label='Include block data' value={includeBlocks} onChange={(e) => setIncludeBlocks(e.target.value === 'true')}>
									<MenuItem value={'true'}>Yes</MenuItem>
									<MenuItem value={'false'}>No</MenuItem>
								</Select>
							</FormControl>
						</Stack>
						{postApiResponse && (
							<Stack gap={2} boxShadow={1} padding={2}>
								<Typography>Response</Typography>
								<Box border={1} borderRadius={1} borderColor='grey.400' padding={2}>
									<pre style={{ maxHeight: '600px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
										<code>{postApiResponse}</code>
									</pre>
								</Box>
							</Stack>
						)}
					</Stack>
				</AccordionDetails>
				<AccordionActions>
					<Button color='success' onClick={fetchPostData}>Send Request</Button>
				</AccordionActions>
			</Accordion>
		</Stack>
	)
}
