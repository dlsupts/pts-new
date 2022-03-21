import { matchSorter } from 'match-sorter'
import { IdType, Row } from 'react-table'

function fuzzyTextFilterFn<T extends object>(rows: Row<T>[], id: IdType<T>[], filterValue: string) {
	return matchSorter(rows, filterValue, { keys: [row => row.values[id.toString()]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val: string) => !val

const filterTypes = {
	fuzzyText: fuzzyTextFilterFn,
	text: <T extends object>(rows: Row<T>[], id: IdType<T>[], filterValue: string) => {
		return rows.filter(row => {
			const rowValue = row.values[id.toString()]
			return rowValue !== undefined
				? String(rowValue)
					.toLowerCase()
					.startsWith(String(filterValue).toLowerCase())
				: true
		})
	}
}

export default filterTypes
