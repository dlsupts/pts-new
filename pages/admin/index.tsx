import AdminLayout from '@components/admin-layout'
import { NextPage } from 'next'
import { PieChart, Pie, Legend, Cell, Tooltip, Label, ResponsiveContainer } from 'recharts'
import styles from '@styles/Dashboard.module.css'
import { useRetriever } from '@lib/useRetriever'
import Head from 'next/head'
import { siteTitle } from '@components/layout'
import { Statistics } from '@pages/api/statistics'
import LoadingSpinner from '@components/loading-spinner'
import DashboardTable from '@components/admin/dashboard-table'
import { useMemo, useState } from 'react'
import { DownloadIcon } from '@heroicons/react/outline'
import app from '@lib/axios-config'
import { interpolateCool } from 'd3-scale-chromatic'
import interpolateColors from '@lib/color-generator'

const scale = interpolateCool
const legend = <Legend verticalAlign="bottom" height={36} iconType="square" />
const tooltip = <Tooltip allowEscapeViewBox={{ x: true, y: true }} />
const PIE_CHART_CONFIG = {
	width: 400,
	height: 300,
}
const PIE_CONFIG = {
	dataKey: "count",
	paddingAngle: 2,
	innerRadius: 70,
	outerRadius: 90,
	label: true
}

const AdminPage: NextPage = () => {
	const { data, isLoading } = useRetriever<Statistics>('/api/statistics')
	const totalTutees = useMemo(() => data?.[1] ? data[1].reduce((sum, i) => sum + i.count, 0) : 0, [data])
	const totalTutors = useMemo(() => data?.[3] ? data[3].reduce((sum, i) => sum + i.count, 0) : 0, [data])
	const totalRequests = useMemo(() => data?.[0] ? data[0].reduce((sum, i) => sum + i.count, 0) : 0, [data])
	const [isWaiting, setIsWaiting] = useState(false)
	let colors: string[]

	if (isLoading || !data) {
		return (
			<AdminLayout>
				<LoadingSpinner />
			</AdminLayout>
		)
	}

	async function handleDownloadClick() {
		setIsWaiting(true)
		const { data } = await app.get<string>('/api/statistics/download')

		const filePath = 'data:application/zip;base64,' + data
		const a = document.createElement('a')
		a.href = filePath
		a.download = 'export.zip'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		setIsWaiting(false)
	}

	return (
		<AdminLayout>
			<Head>
				<title>{siteTitle} | Dashboard</title>
			</Head>
			<div className="flex justify-end mb-2">
				<button className="btn blue px-4 py-2 rounded-md flex items-center space-x-2" disabled={isWaiting} onClick={handleDownloadClick}>
					<DownloadIcon className="w-5" />
					<span>Download Reports</span>
				</button>
			</div>
			<div className="space-y-4">
				<section className={styles.section}>
					<h1>Tutor Request Statistics ({totalRequests})</h1>
					<DashboardTable data={data[0]} />
				</section>

				<section className={styles.section}>
					<h1>Tutee Demographic ({totalTutees})</h1>
					<div className={styles['graphs-container']}>
						<div>
							<ResponsiveContainer>
								<PieChart {...PIE_CHART_CONFIG}>
									{legend}
									{tooltip}
									<Pie data={data[2]} {...PIE_CONFIG}>
										{(colors = interpolateColors(data[2].length, scale)) &&
											data[2].map((entry, index) => (
												<Cell key={entry._id} name={entry._id} fill={colors[index]} />
											))}
										<Label className={styles['middle-label']} position="center">
											ID Number
										</Label>
									</Pie>
								</PieChart>
							</ResponsiveContainer>
						</div>
						<div>
							<ResponsiveContainer>
								<PieChart {...PIE_CHART_CONFIG}>
									{legend}
									{tooltip}
									<Pie data={data[1]} {...PIE_CONFIG}>
										{(colors = interpolateColors(data[1].length, scale)) &&
											data[1].map((entry, index) => (
												<Cell key={entry._id} name={entry._id} fill={colors[index]} />
											))}
										<Label className={styles['middle-label']} position="center">
											College
										</Label>
									</Pie>
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>
				</section>

				<section className={styles.section}>
					<h1>Tutor Demographic ({totalTutors})</h1>
					<div className={styles['graphs-container']}>
						<div>
							<ResponsiveContainer>
								<PieChart {...PIE_CHART_CONFIG}>
									{legend}
									{tooltip}
									<Pie data={data[3]} {...PIE_CONFIG}>
										{(colors = interpolateColors(data[3].length, scale)) &&
											data[3].map((entry, index) => (
												<Cell key={entry._id} name={entry._id} fill={colors[index]} />
											))}
										<Label className={styles['middle-label']} position="center">
											ID Number
										</Label>
									</Pie>
								</PieChart>
							</ResponsiveContainer>
						</div>
						<div>
							<ResponsiveContainer>
								<PieChart {...PIE_CHART_CONFIG}>
									{legend}
									{tooltip}
									<Pie data={data[4]} {...PIE_CONFIG}>
										{(colors = interpolateColors(data[4].length, scale)) &&
											data[4].map((entry, index) => (
												<Cell key={entry._id} name={entry._id} fill={colors[index]} />
											))}
										<Label className={styles['middle-label']} position="center">
											Program
										</Label>
									</Pie>
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>
				</section>
			</div >
		</AdminLayout >
	)
}

export default AdminPage