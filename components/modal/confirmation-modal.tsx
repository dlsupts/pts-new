import Modal, { IModalProps } from '../modal'
import { FC, useRef } from 'react'
import styles from '@styles/Modal.module.css'

type ConfimationModalProps = IModalProps & {
	message: string
	onActionClick: () => void
}

const ConfirmationModal: FC<ConfimationModalProps> = ({ isOpen, onClose, onActionClick, message }) => {
	const cancelButton = useRef<HTMLButtonElement>(null)

	return (
		<Modal isOpen={isOpen} close={onClose} initialFocus={cancelButton}>
			<div className={styles.panel}>
				<div className={styles['confirmation-body']}>
					<p className="text-xl">{message}</p>
					<div className={styles['btn-group']}>
						<button type="button" className={styles.btn + ' btn gray'} ref={cancelButton} onClick={onClose}>Cancel</button>
						<button type="button" className={styles.btn + ' btn red'} onClick={onActionClick}>Confirm</button>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default ConfirmationModal
