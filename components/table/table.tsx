/* eslint-disable react/jsx-key */
import { Column, useTable, useGlobalFilter, useSortBy } from 'react-table'
import cn from 'classnames'
import GlobalFilter from './global-filter'
import filterTypes from './filter-types'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/outline'

type tableprops<T extends object> = {
	columns: readonly Column<T>[]
	data: T[]
	onRowClick?: (id: string) => void
}

const Table = <T extends object>({ columns, data, onRowClick }: tableprops<T>) => {
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
			defaultCanSort: true,
			autoResetSortBy: false,
			autoResetGlobalFilter: false,
		},
		useGlobalFilter,
		useSortBy,
	)

	return (
		<div className="py-2 align-middle inline-block w-full sm:px-6 lg:px-8 overflow-x-auto">
			<GlobalFilter
				globalFilter={state.globalFilter}
				setGlobalFilter={setGlobalFilter}
			/>
			<div className="w-full overflow-x-auto">
				<table {...getTableProps()} className="min-w-full divide-y divide-gray-200 table-fixed rounded-lg shadow-md overflow-hidden">
					<thead className="bg-gray-100">
						{headerGroups.map(headerGroup => (
							<tr className="text-gray-600" {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider select-none"
										{...column.getHeaderProps(column.getSortByToggleProps())}>
										{column.render('Header')}
										<div className="ml-1 w-4 inline-grid place-items-center">
											{column.isSorted ?
												(column.isSortedDesc ? <ChevronUpIcon className="w-3 inline" /> : <ChevronDownIcon className="w-3 inline" />)
												:
												' '
											}
										</div>
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
						{rows.map((row, i) => {
							prepareRow(row)
							return (
								<tr {...row.getRowProps()} className={cn({ 'bg-gray-50': i % 2, 'cursor-pointer hover:text-gray-900': onRowClick }, 'text-gray-600')}
									onClick={() => onRowClick && onRowClick(row.id)}>
									{row.cells.map(cell => {
										return <td {...cell.getCellProps()} className="px-6 py-3 whitespace-nowrap text-sm">{cell.render('Cell')}</td>
									})}
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Table
