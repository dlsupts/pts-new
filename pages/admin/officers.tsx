import { NextPage } from 'next'
import { useMemo } from 'react'
import { useState } from 'react'
import useSWR from 'swr'
import AdminLayout from '@components/admin-layout'
import Committee from '@components/admin/officers/commitee'
import LoadingSpinner from '@components/loading-spinner'
import app from '@lib/axios-config'
import { ICommittee } from '@models/committee'
import AddOfficerModal, { AddOfficerSchema } from '@components/admin/officers/add-officer-modal'
import { IUser } from '@models/user'
import UpdateOfficerModal, { UpdateOfficerSchema } from '@components/admin/officers/update-officer-modal'
import DeleteOfficerModal from '@components/admin/officers/delete-officer-modal'
import DeleteCommitteeModal from '@components/admin/officers/delete-committee-modal'
import AddCommitteeModal, { AddCommitteeSchema } from '@components/admin/officers/add-committee-modal'

function useCommittees() {
	const { data, error, mutate } = useSWR('/api/committees', url => app.get<ICommittee[]>(url))

	return {
		committees: data?.data,
		isLoading: !data?.data && !error,
		isError: !!error,
		mutate,
	}
}

function useTutors() {
	const { data } = useSWR('/api/tutors?query=simple', url => app.get<IUser[]>(url))

	return {
		tutors: data?.data,
	}
}

const OfficerPage: NextPage = () => {
	const { committees, isLoading, mutate } = useCommittees()
	const { tutors } = useTutors()
	const [modal, setModal] = useState('')
	const [selection, setSelection] = useState([0, 0])
	const committee = useMemo(() => committees?.[selection[0]], [committees, selection])
	const officer = useMemo(() => committee?.officers[selection[1]], [committee, selection])

	function closeModal() {
		setModal('')
	}

	async function deleteOfficer() {
		await app.delete(`/api/committees/${committee?._id}/officers/${officer?.user}`)
		await mutate()
		setModal('')
	}

	async function updateOfficer(data: UpdateOfficerSchema) {
		await app.patch(`/api/committees/${committee?._id}/officers/${officer?.user}`, data)
		await mutate()
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
			<UpdateOfficerModal isOpen={modal === 'update officer'} officer={officer} onClose={closeModal} onSubmit={updateOfficer} />
			<DeleteOfficerModal isOpen={modal === 'delete officer'} officer={officer} onClose={closeModal} onDelete={deleteOfficer} />
			<AddOfficerModal isOpen={modal === 'add officer'} onClose={closeModal} users={tutors || []} onSubmit={addOfficer} />
			<DeleteCommitteeModal isOpen={modal === 'delete committee'} onClose={closeModal} committee={committee} onDelete={deleteCommittee} />
			<AddCommitteeModal isOpen={modal === 'add committee'} onClose={closeModal} onSubmit={addCommittee} />
			<div className="flex justify-end mb-6 -mt-2">
				<button className="btn gray px-4 py-2 rounded-lg mr-2">Sort Order</button>
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
