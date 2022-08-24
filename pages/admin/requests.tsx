import AdminLayout from '@components/admin-layout'
import { NextPage } from 'next'
import { ITutorInfo, IUserInfo } from '@models/user'
import { ITutee } from '@models/tutee'
import { BareSession, IReqSession } from '@pages/api/requests'
import { useEffect, useMemo, useRef, useState } from 'react'
import RequestTable from '@components/admin/requests/request-table'
import LoadingSpinner from '@components/loading-spinner'
import { useRetriever } from '@lib/useRetriever'
import Modal from '@components/modal'
import styles from '@styles/Modal.module.css'
import { Dialog, Switch } from '@headlessui/react'
import TuteeDisclosure from '@components/admin/requests/tutee-disclosure'
import MySwitch from '@components/switch'
import TutorTable from '@components/admin/requests/tutor-table'
import cn from 'classnames'
import TutorModal from '@components/table/tutor-modal'
import app from '@lib/axios-config'
import { toastAxiosError } from '@lib/utils'
import { ObjectId } from 'mongoose'
import Head from 'next/head'
import { siteTitle } from '@components/layout'
import sorter from '@lib/sorter'
import LoadingButton from '@components/loading-button'

export type Tutor = Omit<ITutorInfo, 'membership'> & Pick<IUserInfo, 'firstName' | 'lastName' | '_id'>

const RequestPage: NextPage = () => {
	const { data: requests, isLoading: isRequestLoading, mutate: mutateRequests } = useRetriever<IReqSession[]>('/api/requests', [])
	const { data: tutees, isLoading: isTuteeLoading } = useRetriever<ITutee[], Map<string, ITutee>>('/api/tutees', [],
		(tutees: ITutee[]) => {
			const map = new Map<string, ITutee>()
			for (let i = 0; i < tutees.length; i++) {
				map.set(tutees[i]._id.toString(), tutees[i])
			}

			return map
		})
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
	const [request, setRequest] = useState<IReqSession>()
	const [sessions, setSessions] = useState<BareSession[]>([])
	const unassignedSessionsCount = useMemo(() => (sessions.filter(s => !s.tutor)).length, [sessions])
	const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({})
	const [tutor, setTutor] = useState<Tutor>()
	const cancelButton = useRef<HTMLButtonElement>(null)
	const tutorArray = useMemo(() => {
		const tutee = tutees.get(request?.tutee as string)
		if (!request || !tutee) {
			return Array.from(tutors.values())
		}
		return sorter(Array.from(tutors.values()), request, tutee, requestMode ? sessions : [request.session])
	}, [tutors, request, requestMode, sessions, tutees])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		// clear tutor selection every time modal closes
		if (modal == '') {
			setTimeout(() => setRowSelection({}), 50)
		}
	}, [modal])

	function onRequestRowClick(data: IReqSession, index: number) {
		setRequest(data)

		const temp: BareSession[] = []
		for (let i = index; i < requests.length; i++) {
			// only push in unmatched subjects
			if (requests[i]._id == data._id) {
				temp.push(requests[i].session)
			} else {
				break
			}
		}

		for (let i = index - 1; i >= 0; i--) {
			if (requests[i]._id == data._id) {
				temp.push(requests[i].session)
			} else {
				break
			}
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
				await app.patch(`/api/requests/${request?._id}/sessions/${request?.session._id}`, { tutor })
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
				await app.delete(`/api/requests/${request?._id}/sessions/${request?.session._id}`)
			}
			await mutateTutors()
			await mutateRequests()
			setModal('')
		} catch (err) {
			toastAxiosError(err)
		}
		setIsLoading(false)
	}

	const tableInstance = RequestTable({ data: requests, onRowClick: onRequestRowClick, tutors, tutees })

	if (isTuteeLoading || isTutorLoading || isRequestLoading) {
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
									tutee={tutees.get(request?.tutee as string)}
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
								{' '}{tutees.get(request?.tutee as string)?.firstName}&apos;s{' '}
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
				requests.length ? tableInstance :
					<div className="grid place-items-center h-[calc(100vh-theme(spacing.64))]">
						<h1 className="text-2xl font-medium text-gray-400">No Requests Yet</h1>
					</div>
			}
		</AdminLayout >
	)
}

export default RequestPage