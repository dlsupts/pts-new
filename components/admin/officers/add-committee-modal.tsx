import Modal, { IModalProps } from '@components/modal'
import { FC, useRef, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import styles from '@styles/Modal.module.css'
import { Dialog } from '@headlessui/react'
import LoadingButton from '@components/loading-button'

const addCommitteeSchema = yup.object({
	name: yup.string().required('Committee name is required!')
})

export type AddCommitteeSchema = yup.InferType<typeof addCommitteeSchema>

type AddCommitteeModalProps = IModalProps & {
	onSubmit: (data: AddCommitteeSchema) => Promise<void>
}

const AddCommitteeModal: FC<AddCommitteeModalProps> = ({ isOpen, onClose, onSubmit }) => {
	const cancelButton = useRef<HTMLButtonElement>(null)
	const { register, handleSubmit, formState: { errors }, reset } = useForm<AddCommitteeSchema>({
		resolver: yupResolver(addCommitteeSchema),
	})
	const [isLoading, setIsLoading] = useState(false)

	async function getSubmission(data: AddCommitteeSchema) {
		setIsLoading(true)
		await onSubmit(data)
		reset()
		setIsLoading(false)
	}

	return (
		<Modal isOpen={isOpen} close={onClose} initialFocus={cancelButton}>
			<div className={styles.panel}>
				<div className={styles.body}>
					<Dialog.Title as="h3" className={styles.title}>Add Committee</Dialog.Title>
					<form id="update" onSubmit={handleSubmit(getSubmission)}>
						<label htmlFor="name">Committee name</label>
						<input type="text" {...register('name')} id="name" />
						<p className="form-err-msg text-sm">{errors.name?.message}</p>
					</form>
				</div>
				<div className={styles.footer}>
					<button className={styles.btn + ' btn gray'} ref={cancelButton} onClick={onClose} disabled={isLoading}>Cancel</button>
					<LoadingButton form="update" className={styles.btn + ' btn blue'} isLoading={isLoading}>Add</LoadingButton>
				</div>
			</div>
		</Modal>
	)
}

export default AddCommitteeModal
