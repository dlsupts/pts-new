import { NextPage } from 'next'
import AdminLayout from '@components/admin-layout'
import app from '@lib/axios-config'
import type { IUserInfo } from '@models/user'
import Table from '@components/table/table'
import { useCallback, useRef, useState } from 'react'
import Modal from '@components/modal'
import cn from 'classnames'
import styles from '@styles/Sessions.module.css'
import modalStyles from '@styles/Modal.module.css'
import { toast } from 'react-toastify'
import { toastErrorConfig, toastSuccessConfig } from '@lib/toast-defaults'
import Link from 'next/link'
import LoadingSpinner from '@components/loading-spinner'
import { useRetriever } from '@lib/useRetriever'
import { createColumnHelper } from '@tanstack/react-table'
import Head from 'next/head'
import { siteTitle } from '@components/layout'

const columnHelper = createColumnHelper<IUserInfo>()

const columns = [
	//@ts-ignore: TypeError: Recursively deep, library/typescript limitation. 
	columnHelper.accessor('idNumber', { header: 'ID Number' }),
	columnHelper.accessor('lastName', { header: 'Last Name' }),
	columnHelper.accessor('firstName', { header: 'First Name' }),
	columnHelper.accessor('email', { header: 'email' }),
	columnHelper.accessor('url', { header: 'URL' }),
]

const ApplicantsPage: NextPage = () => {
	const { data: applicants, mutate, isLoading } = useRetriever<IUserInfo[]>('/api/applications', [])
	const [isOpen, setIsOpen] = useState(false) // for application info modal
	const [applicant, setApplicant] = useState<IUserInfo>()
	const [isDelOpen, setIsDelOpen] = useState<boolean>(false)
	const cancelButton = useRef<HTMLButtonElement>(null)

	function handleDelClose() {
		setIsDelOpen(false)
		setIsOpen(true)
	}

	async function handleDeleteRecord() {
		try {
			await app.delete(`/api/applications/${applicant?._id}`)
			await mutate()
			setIsDelOpen(false)
			toast.success('Applicant record was deleted.', toastSuccessConfig)
		} catch {
			toast.error('A server-side error has occured. Please try agian later.', toastErrorConfig)
		}
	}

	async function handleAcceptApplicant() {
		try {
			await app.post('/api/tutors', { _id: applicant?._id }) // also deletes tutor entry in the backend
			await mutate()
			setIsOpen(false)
			toast.success('Tutor record was created.', toastSuccessConfig)
		} catch {
			toast.error('A server-side error has occured. Please try agian later.', toastErrorConfig)
		}
	}

	const onRowClick = useCallback((id: string) => {
		setIsOpen(true)
		setApplicant(applicants?.[Number(id)])
	}, [applicants])

	const tableInstance = Table({ columns, data: applicants, onRowClick })

	return (
		<AdminLayout>
			<Head>
				<title>{siteTitle} | Applicants</title>
			</Head>
			<Modal isOpen={isOpen} close={() => setIsOpen(false)}>
				<div className={modalStyles.panel}>
					<div className={cn(styles['data-display'], '!border-0')}>
						<div className={cn(styles.header, 'flex justify-between')}>
							<h3>{applicant?.firstName} {applicant?.lastName}</h3>
							<button className="btn red px-4 py-1 rounded-md text-sm" onClick={() => { setIsDelOpen(true); setIsOpen(false) }}>Delete</button>
						</div>
						<div className={styles.content}>
							<div>
								<p className={styles.label}>ID Number</p>
								<p className={styles.data}>{applicant?.idNumber}</p>
							</div>
							<div>
								<p className={styles.label}>Degree Program</p>
								<p className={styles.data}>{applicant?.course}</p>
							</div>
							<div>
								<p className={styles.label}>Contact</p>
								<p className={styles.data}>{applicant?.contact}</p>
							</div>
							<div>
								<p className={styles.label}>Remaining Terms</p>
								<p className={styles.data}>{applicant?.terms}</p>
							</div>
							<div className="col-span-full">
								<p className={styles.label}>Email</p>
								<p className={styles.data}>{applicant?.email}</p>
							</div>
							<div className="col-span-full">
								<p className={styles.label}>Facebook URL</p>
								<a href={applicant?.url} className={cn(styles.data, 'underline')}>{applicant?.url}</a>
							</div>
						</div>
					</div>
					<div className="flex items-center px-4 mb-4">
						<button className="btn blue w-full rounded-md py-2" onClick={handleAcceptApplicant}>Accept Applicant</button>
					</div>
				</div>
			</Modal>
			<Modal isOpen={isDelOpen} close={handleDelClose} initialFocus={cancelButton}>
				<div className={modalStyles.panel}>
					<div className={modalStyles['confirmation-body']}>
						<p className="text-xl">Remove <span className="font-medium">{applicant?.firstName}</span>?</p>
						<div className={modalStyles['btn-group']}>
							<button type="button" className={modalStyles.btn + ' btn gray'} ref={cancelButton} onClick={handleDelClose}>Cancel</button>
							<button type="button" className={modalStyles.btn + ' btn red'} onClick={handleDeleteRecord}>Confirm</button>
						</div>
					</div>
				</div>
			</Modal>
			{isLoading ? <LoadingSpinner /> :
				!applicants.length ?
					<p>No Applicants Yet. <Link href="tutors"><a className="underline text-blue-600">Go back.</a></Link></p> :
					tableInstance
			}
		</AdminLayout>
	)
}

export default ApplicantsPage
