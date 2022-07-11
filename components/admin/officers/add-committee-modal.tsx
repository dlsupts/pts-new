import Modal, { IModalProps } from '@components/modal'
import { FC, useRef } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import styles from '@styles/Modal.module.css'
import { Dialog } from '@headlessui/react'

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

	function getSubmission(data: AddCommitteeSchema) {
		onSubmit(data).then(() => reset())
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
					<button className={styles.btn + ' btn gray'} ref={cancelButton} onClick={onClose}>Cancel</button>
					<button form="update" className={styles.btn + ' btn blue'}>Add</button>
				</div>
			</div>
		</Modal>
	)
}

export default AddCommitteeModal
