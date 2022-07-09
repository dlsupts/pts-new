import Modal from '@components/modal'
import { IOfficer } from '@models/committee'
import { FC, useEffect, useRef } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'

const updateOfficerSchema = yup.object({
	image: yup.string().required('Image ID is required!')
})

export type UpdateOfficerSchema = yup.InferType<typeof updateOfficerSchema>

type UpdateOfficerModalProps = {
	isOpen: boolean
	onClose: () => void
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
			<div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
				<h1 className="font-semibold ml-4 text-xl my-4">Update Image</h1>
				<form id="update" className="px-4 my-6" onSubmit={handleSubmit(onSubmit)}>
					<label htmlFor="image">Google Drive File ID</label>
					<input type="text" {...register('image')} id="image" />
					<p className="form-err-msg text-sm">{errors.image?.message}</p>
				</form>
				<div className="flex items-center px-4 mb-4 justify-end">
					<button className="btn gray rounded-md px-4 py-2 mr-2" ref={cancelButton} onClick={onClose}>Cancel</button>
					<button form="update" className="btn blue rounded-md px-4 py-2">Update</button>
				</div>
			</div>
		</Modal>
	)
}

export default UpdateOfficerModal
