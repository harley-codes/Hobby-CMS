'use client'

import { recordToArray } from '@/modules/utility/recordToArray'
import
{
	Add as AddIcon,
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
import { useEffect, useState } from 'react'

const knownMetaKeys: Record<string, () => JSX.Element> = {
	'github': () => <GitHubIcon />,
	'facebook': () => <FacebookIcon />,
	'linkedin': () => <LinkedInIcon />,
	'twitter': () => <TwitterIcon />,
	'youtube': () => <YoutubeIcon />,
	'css': () => <CssIcon />,
	'link': () => <LinkIcon />,
	'url': () => <LinkIcon />,
	'web': () => <LanguageIcon />
}

type Props = {
	meta: Record<string, string>
	onMetaChange: (metaData: Record<string, string>) => void
	onDataValidation: (isValid: boolean) => void
}

export function MetaDataEditor(props: Props)
{
	const { meta, onMetaChange, onDataValidation } = props

	const [workingSet, setWorkingSet] = useState(recordToArray(meta))
	const [newKeyTemp, setNewKeyTemp] = useState('')

	useEffect(() =>
	{
		if (JSON.stringify(recordToArray(meta)) === JSON.stringify(workingSet)) return

		const isValid = allKeysValid()

		if (isValid)
			onMetaChange(Object.fromEntries(workingSet.map(item => [item.key, item.value])))

		onDataValidation(isValid)

		function allKeysValid(): boolean
		{
			const keys = workingSet.map(item => item.key)
			const uniqueKeys = new Set(keys)
			return keys.length === uniqueKeys.size && !keys.some(key => key === '')
		}
	}, [meta, onDataValidation, onMetaChange, workingSet])

	function isKeyInvalid(key: string)
	{
		return key === '' || workingSet.filter(x => x.key == key).length > 1
	}

	function deleteKeyHandler(index: number)
	{
		setWorkingSet(workingSet.filter((item, i) => i !== index))
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
								{knownMetaKeys[item.key] ? knownMetaKeys[item.key]() : <TagIcon />}
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
							{knownMetaKeys[newKeyTemp] ? knownMetaKeys[newKeyTemp]() : <TagIcon />}
						</TableCell>
						<TableCell colSpan={2}>
							<TextField
								fullWidth
								variant="standard"
								size="small"
								value={newKeyTemp}
								onChange={(e) => setNewKeyTemp(e.currentTarget.value)}
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
