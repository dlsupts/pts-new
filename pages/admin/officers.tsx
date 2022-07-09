import { NextPage } from 'next'
import { FormEventHandler, useMemo } from 'react'
import { useRef, useState } from 'react'
import useSWR from 'swr'
import AdminLayout from '@components/admin-layout'
import Committee from '@components/admin/officers/commitee'
import LoadingSpinner from '@components/loading-spinner'
import Modal from '@components/modal'
import app from '@lib/axios-config'
import { ICommittee } from '@models/committee'
import AddOfficerModal, { AddSchema } from '@components/admin/officers/add-modal'
import { IUser } from '@models/user'

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
	const [isUpdateOpen, setIsUpdateOpen] = useState(false)
	const [isDelOpen, setIsDelOpen] = useState(false)
	const [isAddOpen, setIsAddOpen] = useState(false)
	const cancelButton = useRef<HTMLButtonElement>(null)
	const [selection, setSelection] = useState([0, 0])
	const officer = useMemo(() => committees?.[selection[0]].officers[selection[1]], [committees, selection])

	function handleDelClose() {
		setIsDelOpen(false)
		setIsUpdateOpen(true)
	}

	function handleDeleteRecord() {
		// await app.get()
	}

	const updateOfficer: FormEventHandler = async (e) => {
		e.preventDefault()
		const { image } = Object.fromEntries(new FormData(e.target as HTMLFormElement))
		await app.patch(`/api/committees/${committees?.[selection[0]]._id}/officers/${officer?.user}`, { image })
		await mutate()
		setIsUpdateOpen(false)
	}

	async function addOfficer(data: AddSchema) {
		await app.post(`/api/committees/${committees?.[selection[0]]._id}/officers`, data)
		await mutate()
		setIsAddOpen(false)
	}

	function onOfficerClick(committeeIdx: number) {
		return (officerIdx: number) => {
			setSelection([committeeIdx, officerIdx])
			setIsUpdateOpen(true)
		}
	}

	return (
		<AdminLayout>
			<Modal isOpen={isUpdateOpen} close={() => setIsUpdateOpen(false)}>
				<div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
					<h1 className="font-semibold ml-4 text-xl my-4">Update Image</h1>
					<form id="update" className="px-4 my-6" onSubmit={updateOfficer}>
						<label htmlFor="image">Google Drive File ID</label>
						<input type="text" name="image" id="image" defaultValue={officer?.image} />
					</form>
					<div className="flex items-center px-4 mb-4 justify-end">
						<button className="btn gray rounded-md px-4 py-2 mr-2" onClick={() => setIsUpdateOpen(false)}>Cancel</button>
						<button form="update" className="btn blue rounded-md px-4 py-2">Update</button>
					</div>
				</div>
			</Modal>
			<Modal isOpen={isDelOpen} close={handleDelClose} initialFocus={cancelButton}>
				<div className="relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
					<div className="grid place-items-center py-10 gap-y-6">
						<p className="text-xl">Remove <span className="font-medium">{officer?.name}</span>?</p>
						<div className="flex justify-center">
							<button type="button" className="btn gray px-4 py-2 rounded-md mr-4" ref={cancelButton} onClick={handleDelClose}>Cancel</button>
							<button type="button" className="btn red px-4 py-2 rounded-md" onClick={handleDeleteRecord}>Confirm</button>
						</div>
					</div>
				</div>
			</Modal>
			<AddOfficerModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} users={tutors || []} onSubmit={addOfficer} />
			<div className="flex justify-end mb-6 -mt-2">
				<button className="btn gray px-4 py-2 rounded-lg mr-2">Sort Order</button>
				<button className="btn blue px-4 py-2 rounded-lg">Add Committee</button>
			</div>
			{isLoading ? <LoadingSpinner /> :
				<div className="grid gap-y-6">
					{committees?.map((c, i) =>
						<Committee key={c.name} committee={c} onOfficerClick={onOfficerClick(i)} onAddClick={() => { setSelection([i]); setIsAddOpen(true) }} />)
					}
				</div>
			}
		</AdminLayout>
	)
}

export default OfficerPage
