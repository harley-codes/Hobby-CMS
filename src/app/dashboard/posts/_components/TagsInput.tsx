import { Autocomplete, Chip, TextField } from '@mui/material'
import React from 'react'


type Props = {
	tags: string[]
	onChange: (tags: string[]) => void
}

export function TagsInput(props: Props)
{
	const { tags, onChange } = props

	const handleAddTag = (event: React.SyntheticEvent<Element, Event>, value: string[]) =>
	{
		onChange(value)
	}

	const handleRemoveTag = (tagToRemove: string) => () =>
	{
		const newTags = tags.filter(tag => tag !== tagToRemove)
		onChange(newTags)
	}

	return (
		<Autocomplete
			multiple
			options={[]}
			freeSolo
			value={tags}
			onChange={handleAddTag}
			renderTags={(tagValue, getTagProps) =>
				tagValue.map((option, index) => (
					<Chip
						label={option}
						{...getTagProps({ index })}
						onDelete={handleRemoveTag(option)}
						key={index}
					/>
				))
			}
			renderInput={(params) => (
				<TextField
					{...params}
					variant="outlined"
					label="Tags"
					placeholder="Add a tag"
				/>
			)}
		/>
	)
}
