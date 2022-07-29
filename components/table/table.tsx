import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFacetedMinMaxValues,
	flexRender,
	ColumnDef
} from '@tanstack/react-table'
import cn from 'classnames'
import { fuzzyFilter } from './global-filter'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import DebouncedInput from './debounced-input'

type TableProps<T extends object> = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	columns: ColumnDef<T, any>[]
	data: T[]
	onRowClick?: (id: string) => void
	id?: string
}

const Table = <T extends object>({ columns, data, onRowClick, id }: TableProps<T>) => {
	const [globalFilter, setGlobalFilter] = useState('')

	const table = useReactTable<T>({
		data,
		columns,
		filterFns: {
			fuzzy: fuzzyFilter,
		},
		state: {
			globalFilter,
		},
		onGlobalFilterChange: setGlobalFilter,
		//@ts-expect-error: TypeError. Not sure why, but this is the code from the documentation and it works.
		globalFilterFn: fuzzyFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
	})

	return (
		<div className="py-2 align-middle inline-block w-full sm:px-6 lg:px-8 overflow-x-auto">
			<div className="mb-4">
				<label htmlFor="tbl-search">Search</label>
				<DebouncedInput
					id="tbl-search"
					type="text"
					debounce={200}
					value={globalFilter}
					onChange={value => setGlobalFilter(String(value))}
					placeholder="Search records..."
					className="form-input"
				/>
			</div>
			<div className="w-full overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200 table-fixed rounded-lg shadow-md overflow-hidden" id={id}>
					<thead className="bg-gray-100">
						{table.getHeaderGroups().map(headerGroup => (
							<tr key={headerGroup.id} className="text-gray-600">
								{headerGroup.headers.map(header => (
									<th key={header.id} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider select-none">
										{header.isPlaceholder ? null :
											<div className={cn('flex space-x-2 items-center', { 'cursor-pointer select-none': header.column.getCanSort() })}
												onClick={header.column.getToggleSortingHandler()}>
												<p>
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
												</p>
												<div className="w-3">
													{{
														asc: <ChevronUpIcon className="w-3 inline" />,
														desc: <ChevronDownIcon className="w-3 inline" />
													}[header.column.getIsSorted() as string] ?? null}
												</div>
											</div>
										}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{table.getRowModel().rows.map((row, i) => {
							return (
								<tr key={row.id} className={cn({ 'bg-gray-50': i % 2, 'cursor-pointer hover:text-gray-900': onRowClick }, 'text-gray-600')}
									onClick={() => onRowClick && onRowClick(row.id)}>
									{row.getVisibleCells().map(cell => {
										return <td key={cell.id} className="px-6 py-3 whitespace-nowrap text-sm">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
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
