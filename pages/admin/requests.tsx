import AdminLayout from '@components/admin-layout'
import { NextPage } from 'next'
import { ITutorInfo, IUserInfo } from '@models/user'
import { ITutee } from '@models/tutee'
import { IReqSession } from '@pages/api/requests'
import { useCallback, useState } from 'react'
import RequestTable from '@components/admin/requests/request-table'
import LoadingSpinner from '@components/loading-spinner'
import { useRetriever } from '@lib/useRetriever'
import Modal from '@components/modal'
import styles from '@styles/Modal.module.css'
import { Dialog } from '@headlessui/react'
import TuteeDisclosure from '@components/admin/requests/tutee-disclosure'
import MySwitch from '@components/switch'

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
	const [isOpen, setIsOpen] = useState(false)
	const [requestMode, setRequestMode] = useState(false)
	const [selection, setSelection] = useState<IReqSession>()

	const onRowClick = useCallback((data: IReqSession) => {
		setSelection(data)
		setIsOpen(true)
	}, [])

	const tableInstance = RequestTable({ data: requests, onRowClick, tutors, tutees })

	if (isTuteeLoading || isTutorLoading) {
		return (
			<AdminLayout>
				<LoadingSpinner />
			</AdminLayout>
		)
	}

	return (
		<AdminLayout>
			<Modal isOpen={isOpen} close={() => setIsOpen(false)}>
				<div className={styles.panel}>
					<div className={styles.body}>
						<div className={styles['title-container']}>
							<Dialog.Title as="h3" className={styles.title}>Request</Dialog.Title>
							<MySwitch isChecked={requestMode} onChange={() => setRequestMode(!requestMode)} label="Set request mode" />
						</div>
						<div>
							<TuteeDisclosure tutee={tutees.get(selection?.tutee as string)} request={selection} />

						</div>
					</div>
				</div>
			</Modal>
			{requests ? tableInstance : <LoadingSpinner />}
		</AdminLayout>
	)
}

export default RequestPage
