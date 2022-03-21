import { FilterValue, useAsyncDebounce } from 'react-table'
import { FC, useState } from 'react'

type filterprop = {
	globalFilter: string
	setGlobalFilter: (filterValue: FilterValue) => void
}

// Define a default UI for filtering
const GlobalFilter: FC<filterprop> = ({
	globalFilter,
	setGlobalFilter
}) => {
	const [value, setValue] = useState(globalFilter)
	const onChange = useAsyncDebounce(value => {
		setGlobalFilter(value || undefined)
	}, 200)

	return (
		<div className="mb-4">
			<label htmlFor="tbl-search">Search</label>
			<input
				id="tbl-search"
				type="text"
				value={value || ""}
				onChange={e => {
					setValue(e.target.value)
					onChange(e.target.value)
				}}
				placeholder="Search records..."
				className="form-input"
			/>
		</div>
	)
}

export default GlobalFilter
