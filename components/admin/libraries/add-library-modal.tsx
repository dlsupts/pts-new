import Modal, { IModalProps } from '@components/modal'
import { useCallback, useRef, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import styles from '@styles/Modal.module.css'
import { Dialog } from '@headlessui/react'
import LoadingButton from '@components/loading-button'

const addLibrarySchema = yup.object({
	_id: yup.string().required('Committee name is required!'),
	isKeyed: yup.bool().required()
}).required()

export type AddLibrarySchema = yup.InferType<typeof addLibrarySchema>

type AddLibraryModalProps = IModalProps & {
	onSubmit: (data: AddLibrarySchema) => Promise<void>
}

const AddLibraryModal = ({ isOpen, onClose, onSubmit }:AddLibraryModalProps) => {
	const cancelButton = useRef<HTMLButtonElement>(null)
	const [isKeyed, setIsKeyed] = useState(false)
	const { register, handleSubmit, formState: { errors }, reset } = useForm<AddLibrarySchema>({
		defaultValues: { _id: '', isKeyed: false },
		resolver: yupResolver(addLibrarySchema),
	})
	const [isLoading, setIsLoading] = useState(false)

	const handleClose = useCallback(() => {
		onClose()
		reset()
		setIsKeyed(false)
	}, [reset, onClose])

	async function getSubmission(data: AddLibrarySchema) {
		setIsLoading(true)
		data.isKeyed = isKeyed
		await onSubmit(data)
		reset()
		setIsKeyed(false)
		setIsLoading(false)
	}

	return (
		<Modal isOpen={isOpen} close={handleClose} initialFocus={cancelButton}>
			<div className={styles.panel}>
				<div className={styles.body}>
					<Dialog.Title as="h3" className={styles.title}>New Library</Dialog.Title>
					<form id="add-library" onSubmit={handleSubmit(getSubmission)}>
						<label htmlFor="name">Library name</label>
						<input type="text" {...register('_id')} id="name" />
						<p className="form-err-msg text-sm">{errors._id?.message}</p>
						<input type="checkbox" id="keyed" checked={isKeyed} onChange={() => setIsKeyed(!isKeyed)} />
						<label htmlFor="keyed" className="inline ml-1">Keyed</label>
					</form>
				</div>
				<div className={styles.footer}>
					<button className={styles.btn + ' btn gray'} ref={cancelButton} onClick={handleClose} disabled={isLoading}>Cancel</button>
					<LoadingButton form="add-library" className={styles.btn + ' btn blue'} isLoading={isLoading}>Add</LoadingButton>
				</div>
			</div>
		</Modal>
	)
}

export default AddLibraryModal
