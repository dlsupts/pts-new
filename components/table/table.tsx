/* eslint-disable react/jsx-key */
import { Column, useTable, useGlobalFilter } from 'react-table'
import cn from 'classnames'
import GlobalFilter from './global-filter'
import filterTypes from './filter-types'

type tableprops<T extends object> = {
	columns: readonly Column<T>[]
	data: T[]
}

const Table = <T extends object>({ columns, data }: tableprops<T>) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		state,
		setGlobalFilter
	} = useTable<T>(
		{
			columns,
			data,
			filterTypes,
		},
		useGlobalFilter
	)

	return (
		<div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
			<GlobalFilter
				globalFilter={state.globalFilter}
				setGlobalFilter={setGlobalFilter}
			/>
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
