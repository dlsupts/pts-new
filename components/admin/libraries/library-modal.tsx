import Modal, { IModalProps } from '@components/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { ILib } from '@models/library'
import { FC, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import styles from '@styles/Modal.module.css'
import { Dialog } from '@headlessui/react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'

const editLibrarySchema = yup.object({
	code: yup.string().notRequired(),
	content: yup.string().required('Field cannot be empty!'),
})

export type EditLibrarySchema = yup.InferType<typeof editLibrarySchema>

type LibraryModalProps = IModalProps & {
	library?: ILib
	onDelete: () => void
	onUpdate: (item: string[]) => void
}

const LibraryModal: FC<LibraryModalProps> = ({ isOpen, onClose, library, onDelete, onUpdate }) => {
	const cancelButton = useRef<HTMLButtonElement>(null)
	const { register, handleSubmit, formState: { errors } } = useForm<EditLibrarySchema>({
		resolver: yupResolver(editLibrarySchema)
	})
	const [order, setOrder] = useState(library?.content ?? [])

	function onDragEnd(result: DropResult) {
		if (result.source.index === result.destination?.index || !result.destination) return
		const [item] = order.splice(result.source.index, 1)
		order.splice(result.destination.index, 0, item)
		setOrder(order)
	}

	function onSubmit(data: EditLibrarySchema) {
		setOrder(order.concat([library?.isKeyed ? `${data.code}: ${data.content}` : data.content]))
	}

	return (
		<Modal isOpen={isOpen} close={onClose} initialFocus={cancelButton}>
			<div className={styles.panel}>
				<div className={styles.body}>
					<div className="flex justify-between items-center mb-3">
						<Dialog.Title as="h3" className={styles.title + ' !mb-0'}>{library?._id}</Dialog.Title>
						<button className={styles['delete-btn'] + ' btn red'} onClick={onDelete}>Delete</button>
					</div>
					<form id="update" onSubmit={handleSubmit(onSubmit)}>
						<label htmlFor="code">Code</label>
						<input type="text" {...register('code')} id="code" />
						<p className="form-err-msg text-sm">{errors.code?.message}</p>
						<label htmlFor="content">Content</label>
						<input type="text" {...register('content')} id="content" />
						<p className="form-err-msg text-sm">{errors.content?.message}</p>
					</form>
					<DragDropContext onDragEnd={onDragEnd}>
						<Droppable droppableId="library-modal">
							{(provided) => (
								<></>
							)}
						</Droppable>
					</DragDropContext>
				</div>
				<div className={styles.footer}>
					<button className={styles.btn + ' btn gray'} ref={cancelButton} onClick={onClose}>Close</button>
					<button className={styles.btn + ' btn blue'} onClick={() => onUpdate(order)}>Save</button>
				</div>
			</div>
		</Modal>
	)
}

export default LibraryModal
