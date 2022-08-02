import AdminLayout from '@components/admin-layout'
import { NextPage } from 'next'
import { ITutorInfo, IUserInfo } from '@models/user'
import { ITutee } from '@models/tutee'
import { createColumnHelper, Table } from '@tanstack/react-table'
import { IReqSession } from '@pages/api/requests'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import RequestTable from '@components/admin/requests/request-table'
import LoadingSpinner from '@components/loading-spinner'
import { useRetriever } from '@lib/useRetriever'
import Modal from '@components/modal'
import styles from '@styles/Modal.module.css'
import { Dialog } from '@headlessui/react'
import TuteeDisclosure from '@components/admin/requests/tutee-disclosure'
import MySwitch from '@components/switch'

type Tutor = Omit<ITutorInfo, 'membership'> & Pick<IUserInfo, 'firstName' | 'lastName' | '_id'>

const columnHelper = createColumnHelper<IReqSession>()

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

	const columns = useMemo(() => ([
		//@ts-expect-error: TypeScript limitation
		columnHelper.accessor(row => {
			const tutee = tutees.get(row.tutee)
			return `${tutee?.firstName} ${tutee?.lastName}:${row._id}`
		}, {
			id: '_id',
			header: 'Tutee',
			cell: props => {
				const tutee = tutees.get(props.row.original.tutee)
				return `${tutee?.firstName} ${tutee?.lastName}`
			}
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
				return `${tutor?.tuteeCount}/${tutor?.maxTuteeCount}`
			}

			return ''
		}, { id: 'load', header: 'Tutor Load', enableSorting: false }),
	]), [tutors, tutees])

	const onRowClick = useCallback((data: IReqSession) => {
		setSelection(data)
		setIsOpen(true)
	}, [])

	const ref = useRef<Table<IReqSession>>()
	const tableInstance = RequestTable({ columns, data: requests, ref, onRowClick })

	useEffect(() => {
		if (!isTuteeLoading && !isTutorLoading) {
			ref.current?.reset()
			ref.current?.setGrouping(['_id'])
			setTimeout(() => ref.current?.toggleAllRowsExpanded(), 0) // setTimeout is required, for some reason, for this to work
		}
	}, [ref, isTuteeLoading, isTutorLoading, requests])

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
