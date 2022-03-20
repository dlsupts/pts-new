/* eslint-disable react/jsx-key */
import { Column, useTable } from 'react-table'
import cn from 'classnames'

type tableprops<T extends object> = {
	columns: Column<T>[]
	data: T[]
}

const Table = <T extends object>({columns, data }: tableprops<T>) => {
	// Use the state and functions returned from useTable to build your UI
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable({
		columns,
		data,
	})

	// Render the UI for your table
	return (
		<div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
			<table {...getTableProps()} className="w-full divide-y divide-gray-200 table-fixed rounded-lg shadow-md overflow-hidden">
				<thead className="bg-gray-100">
					{headerGroups.map(headerGroup => (
						<tr className="text-gray-600" {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" {...column.getHeaderProps()}>{column.render('Header')}</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
					{rows.map((row, i) => {
						prepareRow(row)
						return (
							<tr {...row.getRowProps()} className={cn({ 'bg-gray-50': i % 2 }, 'text-gray-600')}>
								{row.cells.map(cell => {
									return <td {...cell.getCellProps()} className="px-6 py-3 whitespace-nowrap text-sm">{cell.render('Cell')}</td>
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

export default Table
