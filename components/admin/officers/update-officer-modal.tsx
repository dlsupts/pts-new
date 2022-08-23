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
import LoadingButton from '@components/loading-button'

const updateOfficerSchema = yup.object({
	image: yup.string().required('Image ID is required!'),
	position: yup.string().required('Position is required!'),
})

export type UpdateOfficerSchema = yup.InferType<typeof updateOfficerSchema>

type UpdateOfficerModalProps = IModalProps & {
	onSubmit: (data: UpdateOfficerSchema, userType: string) => Promise<void>
	officer?: IOfficer
}

const UpdateOfficerModal: FC<UpdateOfficerModalProps> = ({ isOpen, onClose, onSubmit, officer }) => {
	const cancelButton = useRef<HTMLButtonElement>(null)
	const { register, handleSubmit, formState: { errors }, reset, clearErrors } = useForm<UpdateOfficerSchema>({
		resolver: yupResolver(updateOfficerSchema),
		mode: 'onBlur'
	})
	const { data, status } = useSession()
	const [isAdmin, setIsAdmin] = useState(officer?.userType == 'ADMIN')
	const [isLoading, setIsLoading] = useState(false)

	function handleClose() {
		onClose()
		clearErrors()
	}

	useEffect(() => {
		if (isOpen) {
			reset(officer)
			setIsAdmin(officer?.userType == 'ADMIN')
		}
	}, [reset, officer, isOpen])

	async function getSubmission(data: UpdateOfficerSchema) {
		setIsLoading(true)
		await onSubmit(data, isAdmin ? 'ADMIN' : 'TUTOR')
		setIsLoading(false)
	}

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
						<div className="control">
							<label htmlFor="position">Position</label>
							<input type="text" id="position" {...register('position')} />
							<p className="form-err-msg text-sm">{errors.position?.message}</p>
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
						<button className={styles.btn + ' btn gray'} ref={cancelButton} onClick={onClose} disabled={isLoading}>Cancel</button>
						<LoadingButton form="update" className={styles.btn + ' btn blue'} isLoading={isLoading}>Update</LoadingButton>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default UpdateOfficerModal
