import Modal, { IModalProps } from '@components/modal'
import { IOfficer } from '@models/committee'
import { FC, useRef } from 'react'
import styles from '@styles/Modal.module.css'

type DeleteOfficerModalProps = IModalProps & {
	onDelete: () => void
	officer?: IOfficer
}

const DeleteOfficerModal: FC<DeleteOfficerModalProps> = ({ isOpen, onClose, officer, onDelete }) => {
	const cancelButton = useRef<HTMLButtonElement>(null)

	return (
		<Modal isOpen={isOpen} close={onClose} initialFocus={cancelButton}>
			<div className={styles.panel}>
				<div className={styles['confirmation-body']}>
					<p className="text-xl">Remove <span className="font-medium">{officer?.name}</span>?</p>
					<div className={styles['btn-group']}>
						<button type="button" className={styles.btn + ' btn gray'} ref={cancelButton} onClick={onClose}>Cancel</button>
						<button type="button" className={styles.btn + ' btn red'} onClick={onDelete}>Confirm</button>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default DeleteOfficerModal
