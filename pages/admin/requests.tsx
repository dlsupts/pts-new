import AdminLayout from '@components/admin-layout'
import { NextPage } from 'next'
import { ITutorInfo, IUserInfo } from '@models/user'
import { ITutee } from '@models/tutee'
import { IReqSession } from '@pages/api/requests'
import { useRef, useState } from 'react'
import RequestTable from '@components/admin/requests/request-table'
import LoadingSpinner from '@components/loading-spinner'
import { useRetriever } from '@lib/useRetriever'
import Modal from '@components/modal'
import styles from '@styles/Modal.module.css'
import { Dialog } from '@headlessui/react'
import TuteeDisclosure from '@components/admin/requests/tutee-disclosure'
import MySwitch from '@components/switch'
import TutorTable from '@components/admin/requests/tutor-table'
import cn from 'classnames'
import TutorModal from '@components/table/tutor-modal'

export type Tutor = Omit<ITutorInfo, 'membership'> & Pick<IUserInfo, 'firstName' | 'lastName' | '_id'>

const RequestPage: NextPage = () => {
	const { data: requests } = useRetriever<IReqSession[]>('/api/requests', [])
	const { data: tutees, isLoading: isTuteeLoading } = useRetriever<ITutee[], Map<string, ITutee>>('/api/tutees', [],
		(tutees: ITutee[]) => {
			const map = new Map<string, ITutee>()
			for (let i = 0; i < tutees.length; i++) {
				map.set(tutees[i]._id.toString(), tutees[i])
			}

			return map
		})
	const { data: tutors, isLoading: isTutorLoading } = useRetriever<Tutor[], Map<string, Tutor>>('/api/tutors?filter=request', [],
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
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
	const [tutor, setTutor] = useState<Tutor>()
	const cancelButton = useRef<HTMLButtonElement>(null)

	function onRequestRowClick(data: IReqSession) {
		setRequest(data)
		setModal('request')
	}

	function onTutorRowClick(tutor: Tutor) {
		setTutor(tutor)
		setModal('tutor')
	}

	const tableInstance = RequestTable({ data: requests, onRowClick: onRequestRowClick, tutors, tutees })

	if (isTuteeLoading || isTutorLoading) {
		return (
			<AdminLayout>
				<LoadingSpinner />
			</AdminLayout>
		)
	}

	return (
		<AdminLayout>
			<Modal isOpen={modal == 'request'} close={() => setModal('')}>
				<div className={styles.panel}>
					<div className={styles.body}>
						<div className={styles['title-container']}>
							<Dialog.Title as="h3" className={styles.title}>{requestMode ? 'Request' : 'Session'}</Dialog.Title>
							<MySwitch isChecked={requestMode} onChange={() => setRequestMode(!requestMode)} label="Set request mode" />
						</div>
						<div>
							<TuteeDisclosure tutee={tutees.get(request?.tutee as string)} request={request} />
							<TutorTable data={Array.from(tutors.values())}
								rowSelection={rowSelection}
								setRowSelection={setRowSelection}
								onRowClick={onTutorRowClick} />
						</div>
					</div>
					<div className={cn(styles.footer, '!justify-between')}>
						<button className={cn(styles.btn, 'btn gray')}>
							Delete
						</button>
						<div className="space-x-2">
							<button className={styles.btn + ' btn gray'} ref={cancelButton} onClick={() => setModal('')}>Close</button>
							<button className={styles.btn + ' btn blue'} disabled={Object.keys(rowSelection).length == 0}>Assign tutor</button>
						</div>
					</div>
				</div>
			</Modal>
			<TutorModal isOpen={modal == 'tutor'} onClose={() => setModal('request')} tutor={tutor} />
			{requests ? tableInstance : <LoadingSpinner />}
		</AdminLayout>
	)
}

export default RequestPage
