import Modal, { IModalProps } from '@components/modal'
import { IUser } from '@models/user'
import { FC, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import styles from '@styles/Modal.module.css'
import { Dialog } from '@headlessui/react'

const addSchema = yup.object({
	user: yup.string().required('User is required'),
	position: yup.string().required('position is required!'),
	image: yup.string().required('image id is required!'),
})

export type AddOfficerSchema = yup.InferType<typeof addSchema>

type AddModalProps = IModalProps & {
	onSubmit: (data: AddOfficerSchema) => Promise<void>
	users: IUser[]
}

const AddOfficerModal: FC<AddModalProps> = ({ isOpen, onClose, onSubmit, users }) => {
	const { register, handleSubmit, formState: { errors }, reset } = useForm<AddOfficerSchema>({
		resolver: yupResolver(addSchema)
	})
	const cancelButton = useRef<HTMLButtonElement>(null)

	const handleClose = useCallback(() => {
		onClose()
		reset()
	}, [reset, onClose])

	const getSubmission = useCallback(async (data: AddOfficerSchema) => {
		onSubmit(data).then(() => reset())
	}, [reset, onSubmit])

	return (
		<Modal isOpen={isOpen} close={handleClose} initialFocus={cancelButton}>
			<div className={styles.panel}>
				<div className={styles.body}>
					<Dialog.Title as="h3" className={styles.title}>Add Officer</Dialog.Title>
					<form id="add-officer" className="grid gap-y-2" onSubmit={handleSubmit(getSubmission)}>
						<div>
							<label htmlFor="user">User</label>
							<select {...register('user')} id="user">
								{users.map(u => <option key={u._id.toString()} value={u._id.toString()}>{u.firstName + ' ' + u.lastName}</option>)}
							</select>
							<p className="form-err-msg text-sm">{errors.user?.message}</p>
						</div>

						<div>
							<label htmlFor="position">Position</label>
							<input type="text" {...register('position')} id="position" />
							<p className="form-err-msg text-sm">{errors.position?.message}</p>
						</div>

						<div>
							<label htmlFor="image">Google Drive File ID</label>
							<input type="text" {...register('image')} id="image" />
							<p className="form-err-msg text-sm">{errors.image?.message}</p>
						</div>
					</form>
				</div>
				<div className={styles.footer}>
					<button className={styles.btn + ' btn gray'}ref={cancelButton} onClick={handleClose}>Cancel</button>
					<button form="add-officer" className={styles.btn + ' btn blue'}>Add</button>
				</div>
			</div>
		</Modal>
	)
}

export default AddOfficerModal
