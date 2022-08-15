import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFacetedMinMaxValues,
	flexRender,
	createColumnHelper,
} from '@tanstack/react-table'
import cn from 'classnames'
import { fuzzyFilter } from '@components/table/global-filter'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/outline'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import DebouncedInput from '@components/table/debounced-input'
import styles from '@styles/Table.module.css'
import { Tutor } from '@pages/admin/requests'
import IndeterminateCheckbox from '@components/table/indeterminate-checkbox'

type TutorTableProps = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Tutor[]
	onRowClick: (tutor: Tutor) => void
	rowSelection: Record<string, boolean>
	setRowSelection: Dispatch<SetStateAction<Record<string, boolean>>>
}

const columnHelper = createColumnHelper<Tutor>()

const TutorTable = ({ data, onRowClick, rowSelection, setRowSelection }: TutorTableProps) => {
	const [globalFilter, setGlobalFilter] = useState('')

	const columns = useMemo(() => [
		columnHelper.display({
			id: 'select',
			cell: ({ row }) => (
				<IndeterminateCheckbox
					checked={row.getIsSelected()}
					indeterminate={row.getIsSomeSelected()}
					onChange={row.getToggleSelectedHandler()}
					className="cursor-pointer"
				/>
			)
		}),
		//@ts-ignore: TypeError: Recursively deep, library/typescript limitation. 
		columnHelper.accessor(row => {
			return `${row._id}:${row.firstName} ${row.lastName}`
		}, {
			cell: (props) => `${props.row.original.firstName} ${props.row.original.lastName}`,
			header: 'Tutor',
			id: '_id',
		}),
		columnHelper.accessor(row => {
			return `${row.tuteeCount}/${row.maxTuteeCount}`
		}, {
			cell(props) {
				const { tuteeCount, maxTuteeCount } = props.row.original
				return <p className={cn({ 'text-red-400': tuteeCount > maxTuteeCount })}>{props.getValue()}</p>
			},
			header: 'Load', id: 'load'
		})
	], [])

	const table = useReactTable<Tutor>({
		data,
		columns,
		filterFns: {
			fuzzy: fuzzyFilter,
		},
		state: {
			globalFilter,
			rowSelection,
		},
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: 'fuzzy',
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		onRowSelectionChange: setRowSelection,
		enableMultiRowSelection: false,
	})

	return (
		<div className="align-middle inline-block w-full overflow-x-auto px-1">
			<div className="mb-4">
				<label htmlFor="tutor-tbl-search">Search</label>
				<DebouncedInput
					id="tutor-tbl-search"
					type="text"
					debounce={200}
					value={globalFilter}
					onChange={value => setGlobalFilter(String(value))}
					placeholder="Search tutors..."
					className="form-input"
				/>
			</div>
			<div className={cn(styles.container, '!h-80')}>
				<table className={cn(styles.table, styles['has-checkbox'])}>
					<thead>
						{table.getHeaderGroups().map(headerGroup => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<th key={header.id}>
										{header.isPlaceholder ? null :
											<div className={cn({ 'cursor-pointer select-none': header.column.getCanSort() })}
												onClick={header.column.getToggleSortingHandler()}>
												<p>
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
												</p>
												<div className={styles['chevron-container']}>
													{{
														asc: <ChevronUpIcon />,
														desc: <ChevronDownIcon />
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
									onClick={() => onRowClick(row.original)}>
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

export default TutorTable
