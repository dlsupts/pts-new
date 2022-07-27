import Modal, { IModalProps } from '@components/modal'
import { IOfficer } from '@models/committee'
import { FC, useEffect, useRef, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { Dialog, Switch } from '@headlessui/react'
import styles from '@styles/Modal.module.css'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '@components/loading-spinner'
import MySwitch from '@components/switch'
import cn from 'classnames'

const updateOfficerSchema = yup.object({
	image: yup.string().required('Image ID is required!'),
})

export type UpdateOfficerSchema = yup.InferType<typeof updateOfficerSchema>

type UpdateOfficerModalProps = IModalProps & {
	onSubmit: (data: UpdateOfficerSchema, userType: string) => Promise<void>
	officer?: IOfficer
}

const UpdateOfficerModal: FC<UpdateOfficerModalProps> = ({ isOpen, onClose, onSubmit, officer }) => {
	const cancelButton = useRef<HTMLButtonElement>(null)
	const { register, handleSubmit, formState: { errors }, setValue, clearErrors } = useForm<UpdateOfficerSchema>({
		resolver: yupResolver(updateOfficerSchema),
	})
	const { data, status } = useSession()
	const [isAdmin, setIsAdmin] = useState(officer?.userType == 'ADMIN')

	function handleClose() {
		onClose()
		clearErrors()
	}

	useEffect(() => {
		if (isOpen) {
			setValue('image', officer?.image || '')
			setIsAdmin(officer?.userType == 'ADMIN')
		}
	}, [setValue, officer, isOpen])

	const getSubmission = (data: UpdateOfficerSchema) => onSubmit(data, isAdmin ? 'ADMIN' : 'TUTOR')

	if (status == 'loading') {
		<LoadingSpinner className="w-20 aspect-square" />
	}

	const isSuperAdmin = data?.user.email == process.env.NEXT_PUBLIC_ADMIN_EMAIL

	return (
		<Modal isOpen={isOpen} close={handleClose} initialFocus={cancelButton}>
			<div className={styles.panel}>
				<div className={styles.body}>
					<Dialog.Title as="h3" className={styles.title}>Update Officer</Dialog.Title>
					<form id="update" onSubmit={handleSubmit(getSubmission)}>
						<div className="control">
							<label htmlFor="image">Google Drive File ID</label>
							<input type="text" {...register('image')} id="image" />
							<p className="form-err-msg text-sm">{errors.image?.message}</p>
						</div>
					</form>
				</div>
				<div className={cn(styles.footer, { '!justify-between': isSuperAdmin })}>
					{isSuperAdmin &&
						<Switch.Group>
							<div className="flex items-center space-x-4">
								<MySwitch isChecked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} />
								<Switch.Label className="inline text-sm font-medium select-none">Make Admin</Switch.Label>
							</div>
						</Switch.Group>
					}
					<div className="flex space-x-4">
						<button className={styles.btn + ' btn gray'} ref={cancelButton} onClick={onClose}>Cancel</button>
						<button form="update" className={styles.btn + ' btn blue'}>Update</button>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default UpdateOfficerModal
