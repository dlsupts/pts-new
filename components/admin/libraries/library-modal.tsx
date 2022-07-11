import Modal, { IModalProps } from '@components/modal'
import { ILib } from '@models/library'
import { FC, useRef } from 'react'

type LibraryModalProps = IModalProps & {
	library: ILib
}

const LibraryModal: FC<LibraryModalProps> = ({ isOpen, onClose }) => {
	const cancelButton = useRef<HTMLButtonElement>(null)
	
	return (
		<Modal isOpen={isOpen} close={onClose} initialFocus={cancelButton}>
		</Modal>
	)
}

export default LibraryModal
