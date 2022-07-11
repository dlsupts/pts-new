import Modal, { IModalProps } from '@components/modal'
import { FC, useCallback, useRef } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import styles from '@styles/Modal.module.css'
import { Dialog } from '@headlessui/react'

const addLibrarySchema = yup.object({
	_id: yup.string().required('Committee name is required!'),
	isKeyed: yup.boolean().default(false).required()
}).required()

export type AddLibrarySchema = yup.InferType<typeof addLibrarySchema>

type AddLibraryModalProps = IModalProps & {
	onSubmit: (data: AddLibrarySchema) => Promise<void>
}

const AddLibraryModal: FC<AddLibraryModalProps> = ({ isOpen, onClose, onSubmit }) => {
	const cancelButton = useRef<HTMLButtonElement>(null)
	const { register, handleSubmit, formState: { errors }, reset } = useForm<AddLibrarySchema>({
		resolver: yupResolver(addLibrarySchema),
	})

	const handleClose = useCallback(() => {
		onClose()
		reset()
	}, [reset, onClose])

	function getSubmission(data: AddLibrarySchema) {
		onSubmit(data).then(() => reset())
	}

	return (
		<Modal isOpen={isOpen} close={onClose} initialFocus={cancelButton}>
			<div className={styles.panel}>
				<div className={styles.body}>
					<Dialog.Title as="h3" className={styles.title}>New Library</Dialog.Title>
					<form id="add-library" onSubmit={handleSubmit(getSubmission)}>
						<label htmlFor="name">Library name</label>
						<input type="text" {...register('_id')} id="name" />
						<p className="form-err-msg text-sm">{errors._id?.message}</p>
						<input type="checkbox" {...register('isKeyed')} id="keyed" />
						<label htmlFor="keyed" className="inline ml-2">Keyed</label>
					</form>
				</div>
				<div className={styles.footer}>
					<button className={styles.btn + ' btn gray'} ref={cancelButton} onClick={handleClose}>Cancel</button>
					<button form="add-library" className={styles.btn + ' btn blue'}>Add</button>
				</div>
			</div>
		</Modal>
	)
}

export default AddLibraryModal
