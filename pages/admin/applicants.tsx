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
import ConfirmationModal from '@components/modal/confirmation-modal'
import LoadingButton from '@components/loading-button'

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
	const { data: applicants, mutate, isLoading: isDataLoading } = useRetriever<IUserInfo[]>('/api/applications', [])
	const [isOpen, setIsOpen] = useState(false) // for application info modal
	const [applicant, setApplicant] = useState<IUserInfo>()
	const [isDelOpen, setIsDelOpen] = useState<boolean>(false)
	const button = useRef<HTMLButtonElement>(null)
	const [isLoading, setIsLoading] = useState(false)

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
		setIsLoading(true)
		try {
			await app.post('/api/tutors', { _id: applicant?._id }) // also deletes tutor entry in the backend
			await mutate()
			setIsOpen(false)
			toast.success('Tutor record was created.', toastSuccessConfig)
		} catch {
			toast.error('A server-side error has occured. Please try agian later.', toastErrorConfig)
		}
		setIsLoading(false)
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
			<Modal isOpen={isOpen} close={() => setIsOpen(false)} initialFocus={button}>
				<div className={modalStyles.panel}>
					<div className={cn(styles['data-display'], '!border-0')}>
						<div className={cn(styles.header, 'flex justify-between')}>
							<h3>{applicant?.firstName} {applicant?.lastName}</h3>
							<button
								className="btn red px-4 py-1 rounded-md text-sm"
								onClick={() => { setIsDelOpen(true); setIsOpen(false) }}
								disabled={isLoading}
							>
								Delete
							</button>
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
						<LoadingButton
							className="btn blue w-full rounded-md py-2"
							onClick={handleAcceptApplicant} ref={button}
							isLoading={isLoading}
						>
							Accept Applicant
						</LoadingButton>
					</div>
				</div>
			</Modal>
			<ConfirmationModal isOpen={isDelOpen} onClose={handleDelClose} onActionClick={handleDeleteRecord}
				message={`Remove ${applicant?.firstName}?`} />
			{
				isDataLoading ? <LoadingSpinner /> :
					!applicants.length ?
						<p>No Applicants Yet. <Link href="tutors"><a className="underline text-blue-600">Go back.</a></Link></p> :
						tableInstance
			}
		</AdminLayout >
	)
}

export default ApplicantsPage
