import { fuzzyFilter } from '@components/table/global-filter'
import { ComplexAggregate } from '@lib/statistics'
import {
	useReactTable,
	createColumnHelper,
	GroupingState,
	ExpandedState,
	getCoreRowModel,
	getFilteredRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFacetedMinMaxValues,
	getGroupedRowModel,
	getExpandedRowModel,
	flexRender,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import styles from '@styles/Table.module.css'
import DebouncedInput from '@components/table/debounced-input'

type DashboardTableProps = {
	data: ComplexAggregate[]
}

const columnHelper = createColumnHelper<ComplexAggregate>()

const DashboardTable = ({ data }: DashboardTableProps) => {
	const [globalFilter, setGlobalFilter] = useState('')
	const [grouping, setGrouping] = useState<GroupingState>([])
	const [expanded, setExpanded] = useState<ExpandedState>(true)

	const columns = useMemo(() => [
		columnHelper.accessor('_id.subject', {
			header: 'Subject',
		}),
		columnHelper.accessor(row => row._id.matched ? 'matched' : 'unmatched', {
			id: 'status',
			header: 'status',
		}),
		columnHelper.accessor('count', {
			header: 'count',
			enableGrouping: false,
			aggregationFn: 'sum'
		})
	], [])

	const table = useReactTable({
		data,
		columns,
		filterFns: {
			fuzzy: fuzzyFilter,
		},
		state: {
			globalFilter,
			grouping,
			expanded,
		},
		onGlobalFilterChange: setGlobalFilter,
		//@ts-expect-error: TypeError. Not sure why, but this is the code from the documentation and it works.
		globalFilterFn: fuzzyFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		getGroupedRowModel: getGroupedRowModel(),
		onGroupingChange: setGrouping,
		getExpandedRowModel: getExpandedRowModel(),
		onExpandedChange: setExpanded,
	})

	useEffect(() => {
		if (grouping.length > 1) {
			setGrouping([grouping[1]])
		}
	}, [grouping])

	return (
		<div className="py-2 px-1 align-middle inline-block w-full overflow-x-auto">
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
											<div className={cn({ 'cursor-pointer select-none': header.column.getCanGroup() })}
												onClick={header.column.getToggleGroupingHandler()}>
												<p>
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
												</p>
												<div className={styles['chevron-container']}>
													{header.column.getIsGrouped() && <p>(Grouped)</p>}
												</div>
											</div>
										}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map(row => {
							return (
								<tr key={row.id}>
									{row.getVisibleCells().map(cell => {
										return (
											<td key={cell.id}>
												{cell.getIsGrouped() ? (
													<>
														<button
															{...{
																onClick: row.getToggleExpandedHandler(),
																style: {
																	cursor: row.getCanExpand()
																		? 'pointer'
																		: 'normal',
																},
															}}
														>
															{row.getIsExpanded() ? '👇' : '👉'}{' '}
															{flexRender(
																cell.column.columnDef.cell,
																cell.getContext()
															)}{' '}
														</button>
													</>
												) : cell.getIsAggregated() ? (
													flexRender(
														cell.column.columnDef.aggregatedCell ??
														cell.column.columnDef.cell,
														cell.getContext()
													)
												) : cell.getIsPlaceholder() ? null : (
													flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)
												)}
											</td>
										)
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

export default DashboardTable
