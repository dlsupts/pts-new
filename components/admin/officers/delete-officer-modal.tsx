import Modal from '@components/modal'
import { IOfficer } from '@models/committee'
import { FC, useRef } from 'react'

type DeleteOfficerModalProps = {
	isOpen: boolean
	onClose: () => void
	onDelete: () => void
	officer?: IOfficer
}

const DeleteOfficerModal: FC<DeleteOfficerModalProps> = ({ isOpen, onClose, officer, onDelete }) => {
	const cancelButton = useRef<HTMLButtonElement>(null)

	return (
		<Modal isOpen={isOpen} close={onClose} initialFocus={cancelButton}>
			<div className="relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
				<div className="grid place-items-center py-10 gap-y-6">
					<p className="text-xl">Remove <span className="font-medium">{officer?.name}</span>?</p>
					<div className="flex justify-center">
						<button type="button" className="btn gray px-4 py-2 rounded-md mr-4" ref={cancelButton} onClick={onClose}>Cancel</button>
						<button type="button" className="btn red px-4 py-2 rounded-md" onClick={onDelete}>Confirm</button>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default DeleteOfficerModal
