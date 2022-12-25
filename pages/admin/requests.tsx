import AdminLayout from '@components/admin-layout'
import { NextPage } from 'next'
import { ITutorInfo, IUserInfo } from '@models/user'
import { RequestAPI } from '@pages/api/requests'
import { useEffect, useMemo, useRef, useState } from 'react'
import RequestTable from '@components/admin/requests/request-table'
import LoadingSpinner from '@components/loading-spinner'
import { useRetriever } from '@lib/useRetriever'
import styles from '@styles/Modal.module.css'
import { Dialog, Switch } from '@headlessui/react'
import MySwitch from '@components/switch'
import cn from 'classnames'
import app from '@lib/axios-config'
import { toastAxiosError } from '@lib/utils'
import { ObjectId } from 'mongoose'
import Head from 'next/head'
import { siteTitle } from '@components/layout'
import sorter from '@lib/sorter'
import LoadingButton from '@components/loading-button'
import { ISession } from '@models/session'
import dynamic from 'next/dynamic'

const TutorTable = dynamic(() => import('@components/admin/requests/tutor-table'))
const TutorModal = dynamic(() => import('@components/table/tutor-modal')) 
const TuteeDisclosure = dynamic(() => import('@components/admin/requests/tutee-disclosure'))
const Modal = dynamic(() => import('@components/modal'))

export type Tutor = Omit<ITutorInfo, 'membership'> & Pick<IUserInfo, 'firstName' | 'lastName' | '_id'>

export interface Request extends Omit<RequestAPI, 'sessions'> {
	session: ISession
}

const RequestPage: NextPage = () => {
	const { data: requests, isLoading: isRequestLoading, mutate: mutateRequests } = useRetriever('/api/requests', [],
		// unwind sessions
		(requests: RequestAPI[]) => {
			const data: Request[] = []

			for (let i = 0; i < requests.length; i++) {
				const { sessions, ...others } = requests[i]
				data.push(...sessions.map(s => ({ session: s, ...others })))
			}

			return data
		}
	)
	const { data: tutors, isLoading: isTutorLoading, mutate: mutateTutors } = useRetriever<Tutor[], Map<string, Tutor>>('/api/tutors?filter=request', [],
		(tutors: Tutor[]) => {
			const map = new Map<string, Tutor>()
			for (let i = 0; i < tutors.length; i++) {
				map.set(tutors[i]._id.toString(), tutors[i])
			}
			return map
		}
	)
	const [modal, setModal] = useState<string>('')
	const [requestMode, setRequestMode] = useState(false)
	const [request, setRequest] = useState<Request>()
	const [sessions, setSessions] = useState<ISession[]>([])
	const unassignedSessionsCount = useMemo(() => (sessions.filter(s => !s.tutor)).length, [sessions])
	const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({})
	const [tutor, setTutor] = useState<Tutor>()
	const cancelButton = useRef<HTMLButtonElement>(null)
	const tutorArray = useMemo(() => {
		if (!request) {
			return Array.from(tutors.values())
		}
		return sorter(Array.from(tutors.values()), request, requestMode ? sessions : [request.session])
	}, [tutors, request, requestMode, sessions])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		// clear tutor selection every time modal closes
		let timeout: NodeJS.Timeout
		if (modal == '') {
			timeout = setTimeout(() => setRowSelection({}), 50)
		}

		return () => clearTimeout(timeout)
	}, [modal])

	function onRequestRowClick(data: Request, index: number) {
		setRequest(data)

		const temp: ISession[] = []
		for (let i = index; i < requests.length; i++) {
			// only push in unmatched subjects
			if (requests[i]._id != data._id) break
			temp.push(requests[i].session)
		}

		for (let i = index - 1; i >= 0; i--) {
			if (requests[i]._id != data._id) break
			temp.push(requests[i].session)
		}

		setSessions(temp)
		setModal('request')
	}

	function onTutorRowClick(tutor: Tutor) {
		setTutor(tutor)
		setModal('tutor')
	}

	async function handleAssign() {
		setIsLoading(true)
		const tutor = tutorArray[Number(Object.keys(rowSelection)[0])]._id
		await updateAssignment(tutor)
		setIsLoading(false)
	}

	async function handleUnassign() {
		setIsLoading(true)
		await updateAssignment(null)
		setIsLoading(false)
	}

	async function updateAssignment(tutor: ObjectId | null) {
		try {
			if (requestMode) {
				await app.patch(`/api/requests/${request?._id}`, { tutor })
			} else {
				await app.patch(`/api/requests/${request?._id}/sessions/${request?.session.subject}`, { tutor })
			}
			await mutateTutors()
			await mutateRequests()
			setModal('')
		} catch (err) {
			toastAxiosError(err)
		}
	}

	async function handleDeleteRecord() {
		setIsLoading(true)
		try {
			if (requestMode) {
				await app.delete(`/api/requests/${request?._id}`)
			} else {
				await app.delete(`/api/requests/${request?._id}/sessions/${request?.session.subject}`)
			}
			await mutateTutors()
			await mutateRequests()
			setModal('')
		} catch (err) {
			toastAxiosError(err)
		}
		setIsLoading(false)
	}

	if (isTutorLoading || isRequestLoading) {
		return (
			<AdminLayout>
				<LoadingSpinner />
			</AdminLayout>
		)
	}

	return (
		<AdminLayout>
			<Head>
				<title>{siteTitle} | Requests</title>
			</Head>
			<Modal isOpen={modal == 'request'} close={() => setModal('')}>
				<div className={styles.panel}>
					<div className={styles.body}>
						<div className={styles['title-container']}>
							<Dialog.Title as="h3" className={styles.title}>{requestMode ? 'Request' : 'Session'}</Dialog.Title>
							<Switch.Group as="div" className="flex space-x-2 items-center">
								<Switch.Label className="select-none">Request mode</Switch.Label>
								<MySwitch isChecked={requestMode} onChange={() => setRequestMode(!requestMode)} label="Set request mode" />
							</Switch.Group>
						</div>
						<div>
							{request &&
								<TuteeDisclosure
									request={request}
									sessions={requestMode ? sessions : [request.session]}
									tutors={tutors}
								/>
							}
							{
								(requestMode && unassignedSessionsCount || !request?.session.tutor) &&
								<TutorTable data={tutorArray}
									rowSelection={rowSelection}
									setRowSelection={setRowSelection}
									onRowClick={onTutorRowClick}
								/>
							}
						</div>
					</div>
					<div className={cn(styles.footer, '!justify-between')}>
						<button className={cn(styles.btn, 'btn gray')} onClick={() => setModal('delete')} disabled={isLoading}>
							Delete
						</button>
						<div className="space-x-2">
							<button className={styles.btn + ' btn gray'} ref={cancelButton} onClick={() => setModal('')} disabled={isLoading}>Close</button>
							{(requestMode && unassignedSessionsCount || !request?.session.tutor) ?
								<LoadingButton
									className={styles.btn + ' btn blue'}
									disabled={Object.keys(rowSelection).length == 0}
									onClick={handleAssign}
									isLoading={isLoading}
								>
									Assign tutor
								</LoadingButton>
								:
								<LoadingButton
									className={styles.btn + ' btn red'}
									onClick={handleUnassign}
									isLoading={isLoading}
								>
									Unmatch Tutor{requestMode && 's'}
								</LoadingButton>
							}
						</div>
					</div>
				</div>
			</Modal>
			<TutorModal isOpen={modal == 'tutor'} onClose={() => setModal('request')} tutor={tutor} />
			<Modal isOpen={modal == 'delete'} close={() => setModal('request')} initialFocus={cancelButton}>
				<div className={styles.panel}>
					<div className={styles['confirmation-body']}>
						<p className="text-xl">Remove
							<span className="font-medium">
								{' '}{request?.tutee.firstName}&apos;s{' '}
							</span>{requestMode ? 'request' : 'session'}?</p>
						<div className={styles['btn-group']}>
							<button className={styles.btn + ' btn gray'} ref={cancelButton} onClick={() => setModal('request')} disabled={isLoading}>Cancel</button>
							<LoadingButton className={styles.btn + ' btn red'} onClick={handleDeleteRecord} isLoading={isLoading}>
								Confirm
							</LoadingButton>
						</div>
					</div>
				</div>
			</Modal>
			{
				requests.length ?
					<RequestTable data={requests} onRowClick={onRequestRowClick} tutors={tutors} />
					:
					<div className="grid place-items-center h-[calc(100vh-theme(spacing.64))]">
						<h1 className="text-2xl font-medium text-gray-400">No Requests Yet</h1>
					</div>
			}
		</AdminLayout >
	)
}

export default RequestPage
