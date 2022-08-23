import { NextPage } from 'next'
import AdminLayout from '@components/admin-layout'
import app from '@lib/axios-config'
import { IUser } from '@models/user'
import LoadingSpinner from '@components/loading-spinner'
import { toast } from 'react-toastify'
import { toastErrorConfig } from '@lib/toast-defaults'
import { useCallback, useMemo, useRef, useState } from 'react'
import Modal from '@components/modal'
import styles from '@styles/Sessions.module.css'
import modalStyles from '@styles/Modal.module.css'
import { days } from '@lib/times'
import cn from 'classnames'
import { ISchedule } from '@models/schedule'
import Link from 'next/link'
import { useRetriever } from '@lib/useRetriever'
import { createColumnHelper } from '@tanstack/react-table'
import Table from '@components/table'
import Head from 'next/head'
import { siteTitle } from '@components/layout'
import ConfirmationModal from '@components/modal/confirmation-modal'

interface ITableProps extends IUser {
	status?: string
}

const columnHelper = createColumnHelper<ITableProps>()

const columns = [
	//@ts-ignore: TypeError: Recursively deep, library/typescript limitation. 
	columnHelper.accessor('idNumber', { header: 'ID Number' }),
	columnHelper.accessor('lastName', { header: 'Last Name' }),
	columnHelper.accessor('firstName', { header: 'First Name' }),
	columnHelper.accessor('email', { header: 'Email' }),
	columnHelper.accessor('status', { header: 'Status' }),
]

const AdminPage: NextPage = () => {
	const { data: tutors, isLoading, isError, mutate: mutateTutors } = useRetriever<(IUser & { status?: string })[]>('/api/tutors')
	const [isOpen, setIsOpen] = useState(false) // for tutor info modal
	const [isDelOpen, setIsDelOpen] = useState(false)
	const [tutor, setTutor] = useState<IUser>()
	const button = useRef<HTMLButtonElement>(null)

	const onRowClick = useCallback((id: string) => {
		setIsOpen(true)
		setTutor(tutors?.[Number(id)])
	}, [tutors])

	function handleDelClose() {
		setIsDelOpen(false)
		setIsOpen(true)
	}

	async function handleDeleteRecord() {
		try {
			await app.delete(`/api/tutors/${tutor?._id}`)
			await mutateTutors()
			setIsDelOpen(false)
		} catch {
			toast.error('A server-side error has occured. Please try agian later.', toastErrorConfig)
		}
	}

	// pre-process data
	const data = useMemo(() => {
		tutors?.forEach(t => {
			if (t.reset) {
				t.status = 'Pending'
			} else {
				t.status = t.membership ? 'Active' : 'Inactive'
			}
		})
		return tutors || []
	}, [tutors])

	if (isError) {
		toast.error('An error has occured. Please try again.', toastErrorConfig)
	}

	const tableInstance = Table<ITableProps>({ columns, data, onRowClick })

	return (
		<AdminLayout>
			<Head>
				<title>{siteTitle} | Tutors</title>
			</Head>
			<Modal isOpen={isOpen} close={() => setIsOpen(false)} initialFocus={button}>
				<div className={modalStyles.panel}>
					<div className={cn(styles['data-display'], '!border-0')}>
						<div className={cn(styles.header, 'flex justify-between')}>
							<h3>{tutor?.firstName} {tutor?.lastName}</h3>
							<button
								className={modalStyles['delete-btn'] + ' btn red'}
								onClick={() => { setIsDelOpen(true); setIsOpen(false) }}
								ref={button}
							>
								Delete
							</button>
						</div>
						<div className={styles.content}>
							<div>
								<p className={styles.label}>ID Number</p>
								<p className={styles.data}>{tutor?.idNumber}</p>
							</div>
							<div>
								<p className={styles.label}>Degree Program</p>
								<p className={styles.data}>{tutor?.course}</p>
							</div>
							<div>
								<p className={styles.label}>Contact</p>
								<p className={styles.data}>{tutor?.contact}</p>
							</div>
							<div>
								<p className={styles.label}>Remaining Terms</p>
								<p className={styles.data}>{tutor?.terms}</p>
							</div>
							<div className="col-span-full">
								<p className={styles.label}>Email</p>
								<p className={styles.data}>{tutor?.email}</p>
							</div>
							<div className="col-span-full">
								<p className={styles.label}>Facebook URL</p>
								<a href={tutor?.url} className={cn(styles.data, 'underline')}>{tutor?.url}</a>
							</div>
							<div className="col-span-full">
								<p className={styles.label}>Schedule</p>
								<table className="w-full shadow-sm">
									<tbody>
										{tutor && days.map((day, index) => (
											<tr key={day.key} className={cn({ 'bg-gray-100': index % 2 })}>
												<td className="font-medium pl-2 py-2 sm:pl-6 w-32 sm:w-36">{day.text}</td>
												<td className="py-2" dangerouslySetInnerHTML={{ __html: (tutor.schedule as ISchedule)[day.key].join('<br>') }} />
											</tr>
										))
										}
									</tbody>
								</table>
							</div>
							<div className="col-span-full">
								<p className={styles.label}>Tutoring Services</p>
								<p className={styles.data}>{tutor?.tutoringService.join(', ')}</p>
							</div>
							<div className="col-span-full">
								<p className={styles.label}>Tutoring Types</p>
								<p className={styles.data}>{tutor?.tutorialType?.join(', ')}</p>
							</div>
							<div className="col-span-full">
								<p className={styles.label}>Tutee Count</p>
								<p className={styles.data}>{tutor?.tuteeCount} out of {tutor?.maxTuteeCount}</p>
							</div>
							<div className="col-span-full">
								<p className={styles.label}>Topics</p>
								{tutor?.topics.map(t => (
									<div key={t[0]} className="my-2">
										<p className='font-medium'>{t[0]}</p>
										<p className="text-sm text-gray-500">Specific Topics: {t[1] || 'None'}</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</Modal>
			<ConfirmationModal
				isOpen={isDelOpen}
				onClose={handleDelClose}
				onActionClick={handleDeleteRecord}
				message={`Remove ${tutor?.firstName}?`}
			/>
			<div className="flex justify-end sm:px-6 lg:px-8">
				<Link href="applicants">
					<a className="btn blue px-4 py-2 rounded-md">View Applicants</a>
				</Link>
			</div>
			{isLoading ? <LoadingSpinner /> : tableInstance}
		</AdminLayout>
	)
}

export default AdminPage