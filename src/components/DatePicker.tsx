'use '

import { useDomLoaded } from '@/modules/utility/useDomLoaded'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTime } from 'luxon'

type Props = {
	label?: string
	value: Date
	onChange: (date: Date) => void
}

export default function DatePicker(props: Props)
{
	const { label, value, onChange } = props

	const date = DateTime.fromJSDate(value)

	const domLoaded = useDomLoaded()

	function onChangeHandler(value: DateTime<true> | DateTime<false> | null)
	{
		if (!value || !value.isValid) return
		onChange(value.toJSDate())
	}

	return (
		<LocalizationProvider dateAdapter={AdapterLuxon}>
			{domLoaded && (
				<MuiDatePicker label={label} value={date} onChange={onChangeHandler} />
			)}
		</LocalizationProvider>
	)
}
