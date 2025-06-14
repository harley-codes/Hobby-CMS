'use client'

import { recordToArray } from '@/modules/utility/recordToArray'
import
{
	Add as AddIcon,
	CloudDownload as CloudDownloadIcon,
	Css as CssIcon,
	Delete as DeleteIcon,
	Facebook as FacebookIcon,
	GitHub as GitHubIcon,
	Language as LanguageIcon,
	Link as LinkIcon,
	LinkedIn as LinkedInIcon,
	Tag as TagIcon,
	Twitter as TwitterIcon,
	YouTube as YoutubeIcon
} from '@mui/icons-material'
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import { JSX, useEffect, useState } from 'react'

const knownMetaKeys: Record<string, () => JSX.Element> = {
	'github': () => <GitHubIcon />,
	'facebook': () => <FacebookIcon />,
	'linkedin': () => <LinkedInIcon />,
	'twitter': () => <TwitterIcon />,
	'youtube': () => <YoutubeIcon />,
	'css': () => <CssIcon />,
	'style': () => <CssIcon />,
	'sx': () => <CssIcon />,
	'link': () => <LinkIcon />,
	'url': () => <LinkIcon />,
	'web': () => <LanguageIcon />,
	'webhook': () => <LanguageIcon />,
	'download': () => <CloudDownloadIcon />,
	'file': () => <CloudDownloadIcon />,
}

type Props = {
	meta: Record<string, string>
	onMetaChange: (metaData: Record<string, string>) => void
	onDataValidation: (isValid: boolean) => void
}

function MetaIcon({ metaKey }: { metaKey: string })
{
	return (knownMetaKeys[metaKey.toLowerCase()] ?? (() => <TagIcon />))()
}

function allKeysValid(workingSet: {
	key: string
	value: string
}[]): boolean
{
	const keys = workingSet.map(item => item.key.toUpperCase())
	const uniqueKeys = new Set(keys)
	return keys.length === uniqueKeys.size && !keys.some(key => key === '')
}

export function MetaDataEditor(props: Props)
{
	const { meta, onMetaChange, onDataValidation } = props

	const [syncedMeta, setSyncedMeta] = useState(meta)
	const [workingSet, setWorkingSet] = useState(recordToArray(meta))
	const [newKeyTemp, setNewKeyTemp] = useState('')
	const [isValid, setIsValid] = useState(true)

	/*
	 * Sync the working set with the meta data
	 * If the meta data is changed from upstream, update the working set
	 * If the working set is changed, update the meta data to upstream
	*/
	useEffect(() =>
	{
		const isMetaEqualToWorkingSet = JSON.stringify(recordToArray(meta)) === JSON.stringify(workingSet)
		const isMetaEqualToSyncedMeta = JSON.stringify(meta) === JSON.stringify(syncedMeta)
		const isValid = allKeysValid(workingSet)

		if (!isMetaEqualToWorkingSet && isMetaEqualToSyncedMeta && isValid)
		{
			const data = Object.fromEntries(workingSet.map(item => [item.key, item.value]))
			onMetaChange(data)
			setSyncedMeta(data)
		}

		if (!isMetaEqualToSyncedMeta)
		{
			setWorkingSet(recordToArray(meta))
			setSyncedMeta(meta)
		}

		setNewKeyTemp('')
	}, [meta, workingSet, syncedMeta, onMetaChange, onDataValidation])

	useEffect(() =>
	{
		const isValidCheck = allKeysValid(workingSet)

		if (isValid !== isValidCheck)
		{
			setIsValid(isValidCheck)
			onDataValidation(isValidCheck)
		}
	}, [isValid, onDataValidation, workingSet])

	function isKeyInvalid(key: string)
	{
		return key === '' || workingSet.filter(x => x.key.toUpperCase() == key.toUpperCase()).length > 1
	}

	function deleteKeyHandler(index: number)
	{
		setWorkingSet(workingSet.filter((_, i) => i !== index))
	}

	function addKeyHandler()
	{
		if (!newKeyTemp) return
		setWorkingSet([...workingSet, { key: newKeyTemp, value: '' }])
		setNewKeyTemp('')
	}

	function updateKeyHandler(index: number, key: string)
	{
		setWorkingSet(workingSet.map((item, i) => i === index ? { ...item, key } : item))
	}

	function updateValueHandler(index: number, value: string)
	{
		setWorkingSet(workingSet.map((item, i) => i === index ? { ...item, value } : item))
	}

	return (
		<TableContainer component={Paper}>
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell width="10px">Meta</TableCell>
						<TableCell width="200px">Key</TableCell>
						<TableCell>Value</TableCell>
						<TableCell width="10px"></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{workingSet.map((item, index) => (
						<TableRow key={index}>
							<TableCell align="center">
								<MetaIcon metaKey={item.key} />
							</TableCell>
							<TableCell>
								<TextField
									fullWidth
									variant="standard"
									size="small"
									value={item.key}
									onChange={(e) => updateKeyHandler(index, e.currentTarget.value)}
									error={isKeyInvalid(item.key)}
								/>
							</TableCell>
							<TableCell>
								<TextField
									fullWidth
									variant="standard"
									value={item.value}
									onChange={(e) => updateValueHandler(index, e.currentTarget.value)}
								/>
							</TableCell>
							<TableCell>
								<IconButton
									size="small"
									onClick={() => deleteKeyHandler(index)}>
									<DeleteIcon fontSize="inherit" />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
					<TableRow>
						<TableCell align="center">
							<MetaIcon metaKey={newKeyTemp} />
						</TableCell>
						<TableCell colSpan={2}>
							<TextField
								fullWidth
								variant="standard"
								size="small"
								value={newKeyTemp}
								onChange={(e) => setNewKeyTemp(e.currentTarget.value)}
								onKeyUp={(e) => e.key === 'Enter' && addKeyHandler()}
							/>
						</TableCell>
						<TableCell>
							<IconButton
								size="small"
								onClick={addKeyHandler}>
								<AddIcon fontSize="inherit" />
							</IconButton>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	)
}
