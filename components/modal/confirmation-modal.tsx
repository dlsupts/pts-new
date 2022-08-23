import Modal, { IModalProps } from '../modal'
import { FC, useRef, useState } from 'react'
import styles from '@styles/Modal.module.css'
import LoadingButton from '@components/loading-button'

type ConfimationModalProps = IModalProps & {
	message: string
	onActionClick: () => Promise<void>
}

const ConfirmationModal: FC<ConfimationModalProps> = ({ isOpen, onClose, onActionClick, message }) => {
	const cancelButton = useRef<HTMLButtonElement>(null)
	const [isLoading, setIsLoading] = useState(false)

	async function handleActionClick() {
		setIsLoading(true)
		await onActionClick()
		setIsLoading(false)
	}

	return (
		<Modal isOpen={isOpen} close={onClose} initialFocus={cancelButton}>
			<div className={styles.panel}>
				<div className={styles['confirmation-body']}>
					<p className="text-xl">{message}</p>
					<div className={styles['btn-group']}>
						<button className={styles.btn + ' btn gray'} ref={cancelButton} onClick={onClose} disabled={isLoading}>Cancel</button>
						<LoadingButton className={styles.btn + ' btn red'} onClick={handleActionClick} isLoading={isLoading}>Confirm</LoadingButton>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default ConfirmationModal
