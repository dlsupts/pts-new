import Modal, { IModalProps } from '@components/modal'
import { IOfficer } from '@models/committee'
import { FC, useEffect, useRef } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { Dialog } from '@headlessui/react'
import styles from '@styles/Modal.module.css'

const updateOfficerSchema = yup.object({
	image: yup.string().required('Image ID is required!')
})

export type UpdateOfficerSchema = yup.InferType<typeof updateOfficerSchema>

type UpdateOfficerModalProps = IModalProps & {
	onSubmit: (data: UpdateOfficerSchema) => Promise<void>
	officer?: IOfficer
}

const UpdateOfficerModal: FC<UpdateOfficerModalProps> = ({ isOpen, onClose, onSubmit, officer }) => {
	const cancelButton = useRef<HTMLButtonElement>(null)
	const { register, handleSubmit, formState: { errors }, setValue } = useForm<UpdateOfficerSchema>({
		resolver: yupResolver(updateOfficerSchema),
	})

	useEffect(() => setValue('image', officer?.image || ''), [setValue, officer?.image])

	return (
		<Modal isOpen={isOpen} close={onClose} initialFocus={cancelButton}>
			<div className={styles.panel}>
				<div className={styles.body}>
					<Dialog.Title as="h3" className={styles.title}>Update Image</Dialog.Title>
					<form id="update" onSubmit={handleSubmit(onSubmit)}>
						<label htmlFor="image">Google Drive File ID</label>
						<input type="text" {...register('image')} id="image" />
						<p className="form-err-msg text-sm">{errors.image?.message}</p>
					</form>
				</div>
				<div className={styles.footer}>
					<button className={styles.btn + ' btn gray'} ref={cancelButton} onClick={onClose}>Cancel</button>
					<button form="update" className={styles.btn + ' btn blue'}>Update</button>
				</div>
			</div>
		</Modal>
	)
}

export default UpdateOfficerModal
