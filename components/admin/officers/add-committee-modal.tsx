import Modal from '@components/modal'
import { FC, useRef } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'

const addCommitteeSchema = yup.object({
	name: yup.string().required('Committee name is required!')
})

export type AddCommitteeSchema = yup.InferType<typeof addCommitteeSchema>

type AddCommitteeModalProps = {
	isOpen: boolean
	onClose: () => void
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
			<div className="relative inline-block align-bottom bg-white w-full rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
				<h1 className="font-semibold ml-4 text-xl my-4">Add Committee</h1>
				<form id="update" className="px-4 my-6" onSubmit={handleSubmit(getSubmission)}>
					<label htmlFor="image">Committee name</label>
					<input type="text" {...register('name')} id="name" />
					<p className="form-err-msg text-sm">{errors.name?.message}</p>
				</form>
				<div className="flex items-center px-4 mb-4 justify-end">
					<button className="btn gray rounded-md px-4 py-2 mr-2" ref={cancelButton} onClick={onClose}>Cancel</button>
					<button form="update" className="btn blue rounded-md px-4 py-2">Add</button>
				</div>
			</div>
		</Modal>
	)
}

export default AddCommitteeModal
