import { NextPage } from 'next'
import { useMemo } from 'react'
import { useState } from 'react'
import AdminLayout from '@components/admin-layout'
import Committee from '@components/admin/officers/commitee'
import LoadingSpinner from '@components/loading-spinner'
import app from '@lib/axios-config'
import { ICommittee } from '@models/committee'
import { AddOfficerSchema } from '@components/admin/officers/add-officer-modal'
import { IUser } from '@models/user'
import { UpdateOfficerSchema } from '@components/admin/officers/update-officer-modal'
import { AddCommitteeSchema } from '@components/admin/officers/add-committee-modal'
import { useRetriever } from '@lib/useRetriever'
import { toast } from 'react-toastify'
import { toastSuccessConfig } from '@lib/toast-defaults'
import Head from 'next/head'
import { siteTitle } from '@components/layout'
import dynamic from 'next/dynamic'

const AddOfficerModal = dynamic(() => import('@components/admin/officers/add-officer-modal'))
const UpdateOfficerModal = dynamic(() => import('@components/admin/officers/update-officer-modal'))
const AddCommitteeModal = dynamic(() => import('@components/admin/officers/add-committee-modal'))
const ChangeOrderModal = dynamic(() => import('@components/admin/officers/change-order-modal'))
const ConfirmationModal = dynamic(() => import('@components/modal/confirmation-modal'))

const OfficerPage: NextPage = () => {
	const { data: committees, isLoading, mutate } = useRetriever<ICommittee[]>('/api/committees')
	const { data: tutors } = useRetriever<IUser[]>('/api/tutors?filter=simple')
	const [modal, setModal] = useState('')
	const [selection, setSelection] = useState([0, 0])
	const committee = useMemo(() => committees?.[selection[0]], [committees, selection])
	const officer = useMemo(() => committee?.officers[selection[1]], [committee, selection])
	const order = useMemo(() => committees?.map(c => c.name), [committees])

	function closeModal() {
		setModal('')
	}

	async function updateOrder(data: string[]) {
		await app.put('/api/libraries/Committees', { content: data })
		await mutate()
		setModal('')
	}

	async function deleteOfficer() {
		await app.delete(`/api/committees/${committee?._id}/officers/${officer?.user}`)
		await mutate()
		setModal('')
	}

	async function updateOfficer(data: UpdateOfficerSchema, userType: string) {
		await app.patch(`/api/committees/${committee?._id}/officers/${officer?.user}`, {
			...data,
			userType
		})
		await mutate()
		toast.success('Officer details updated!', toastSuccessConfig)
		setModal('')
	}

	async function addOfficer(data: AddOfficerSchema) {
		await app.post(`/api/committees/${committee?._id}/officers`, data)
		await mutate()
		setModal('')
	}

	function onOfficerClick(committeeIdx: number) {
		return (officerIdx: number) => (isDelete: boolean) => {
			setSelection([committeeIdx, officerIdx])

			if (isDelete) {
				setModal('delete officer')
			} else {
				setModal('update officer')
			}
		}
	}

	async function deleteCommittee() {
		await app.delete(`/api/committees/${committee?._id}`)
		await mutate()
		setModal('')
	}

	async function addCommittee(data: AddCommitteeSchema) {
		await app.post('/api/committees', data)
		await mutate()
		setModal('')
	}

	return (
		<AdminLayout>
			<Head>
				<title>{siteTitle} | Officers</title>
			</Head>
			<UpdateOfficerModal isOpen={modal === 'update officer'} officer={officer} onClose={closeModal} onSubmit={updateOfficer} />
			<ConfirmationModal isOpen={modal === 'delete officer'} message={`Remove ${officer?.name}?`} onClose={closeModal} onActionClick={deleteOfficer} />
			<AddOfficerModal isOpen={modal === 'add officer'} onClose={closeModal} users={tutors || []} onSubmit={addOfficer} />
			<ConfirmationModal isOpen={modal === 'delete committee'} onClose={closeModal} message={`Remove ${committee?.name}?`} onActionClick={deleteCommittee} />
			<AddCommitteeModal isOpen={modal === 'add committee'} onClose={closeModal} onSubmit={addCommittee} />
			<ChangeOrderModal isOpen={modal === 'sort'} onClose={closeModal} initOrder={order || []} onSubmit={updateOrder} />
			<div className="flex justify-end mb-6">
				<button onClick={() => setModal('sort')} className="btn gray px-4 py-2 rounded-lg mr-2">Sort Order</button>
				<button onClick={() => setModal('add committee')} className="btn blue px-4 py-2 rounded-lg">Add Committee</button>
			</div>
			{isLoading ? <LoadingSpinner /> :
				<div className="grid gap-y-6">
					{committees?.map((c, i) =>
						<Committee key={c.name}
							committee={c}
							onOfficerClick={onOfficerClick(i)}
							onAddClick={() => { setSelection([i]); setModal('add officer') }}
							onDeleteClick={() => { setSelection([i]); setModal('delete committee') }}
						/>)
					}
				</div>
			}
		</AdminLayout>
	)
}

export default OfficerPage
