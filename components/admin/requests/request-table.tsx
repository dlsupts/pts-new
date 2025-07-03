import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFacetedMinMaxValues,
	getGroupedRowModel,
	getExpandedRowModel,
	flexRender,
	GroupingState,
	ExpandedState,
	createColumnHelper,
} from '@tanstack/react-table'
import cn from 'classnames'
import { fuzzyFilter } from '@components/table/global-filter'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/outline'
import { useMemo, useState, useEffect } from 'react'
import DebouncedInput from '@components/table/debounced-input'
import styles from '@styles/Table.module.css'
import { Request, Tutor } from '@pages/admin/requests'

type TableProps = {
	data: Request[]
	onRowClick: (index: number) => void
	tutors: Map<string, Tutor>
}

const columnHelper = createColumnHelper<Request>()

const RequestTable = ({ data, onRowClick, tutors }: TableProps) => {
	const [globalFilter, setGlobalFilter] = useState('')
	const [grouping, setGrouping] = useState<GroupingState>([])
	const [expanded] = useState<ExpandedState>(true)
	let shouldPrint = false
	let ctr = 1

	const columns = useMemo(() => ([
		columnHelper.accessor('_id', {
			header: 'Tutee',
			id: '_id',
			cell: ({ row: { original } }) => `${original.tutee.firstName} ${original.tutee.lastName}`
		}),
		columnHelper.accessor(({ tutee }) => `${tutee.firstName} ${tutee.lastName}`, {
			id: 'tutee'
		}),
		columnHelper.accessor('session.subject', { header: 'Subject', enableSorting: false }),
		columnHelper.accessor(row => {
			if (row.session.tutor) {
				const tutor = tutors.get(row.session.tutor.toString())
				return `${tutor?.firstName} ${tutor?.lastName}`
			}

			return ''
		}, { id: 'tutor', header: 'Tutor', enableSorting: false }),
		columnHelper.accessor(row => {
			if (row.session.tutor) {
				const tutor = tutors.get(row.session.tutor.toString())
				return `${tutor?.tuteeCount} / ${tutor?.maxTuteeCount}`
			}

			return ''
		}, { id: 'load', header: 'Tutor Load', enableSorting: false }),
	]), [tutors])

	const table = useReactTable<Request>({
		data,
		columns,
		filterFns: {
			fuzzy: fuzzyFilter,
		},
		state: {
			globalFilter,
			grouping,
			expanded,
			columnVisibility: { tutee: false }
		},
		onGlobalFilterChange: (str: string) => {
			setGlobalFilter(str)
			table.toggleAllRowsExpanded()
		},
		globalFilterFn: 'fuzzy',
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		getGroupedRowModel: getGroupedRowModel(),
		onGroupingChange: setGrouping,
		getExpandedRowModel: getExpandedRowModel(),
	})

	useEffect(() => {
		table.reset()
		table.setGrouping(['_id'])
		setTimeout(() => table.toggleAllRowsExpanded(), 0) // setTimeout is required, for some reason, for this to work
	}, [table])

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
			<div className={styles.container}>
				<table className={styles.table}>
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
					<tbody className="bg-white">
						{data.length == 0 ? null :
							table.getRowModel().rows.map(row => (
								(row.subRows.length ? true : ctr++) &&
								<tr key={row.id} className={cn({
									'bg-gray-50': ctr % 2,
									'cursor-pointer hover:text-gray-900': onRowClick,
									'hidden': row.subRows.length
								}, 'text-gray-600')} onClick={() => onRowClick(row.index)}>
									{row.getVisibleCells().map(cell => (
										<td key={cell.id} className={cn({ 'bg-white': cell.getIsPlaceholder() })}>
											{cell.getIsGrouped() ? (
												(shouldPrint = true) && <></>
											) : cell.getIsPlaceholder() ? (
												shouldPrint ? !(shouldPrint = false) && flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												) : null
											) : flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									)
									)}
								</tr>
							)
							)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default RequestTable
