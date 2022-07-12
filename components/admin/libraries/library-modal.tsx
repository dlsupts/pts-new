import Modal, { IModalProps } from '@components/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { ILib } from '@models/library'
import { FC, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import styles from '@styles/Modal.module.css'
import { Dialog } from '@headlessui/react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { MenuIcon, PlusIcon, TrashIcon } from '@heroicons/react/outline'
import cn from 'classnames'

const editLibrarySchema = yup.object({
	code: yup.string().required().trim(),
	content: yup.string().required('Field cannot be empty!').trim(),
})

export type EditLibrarySchema = yup.InferType<typeof editLibrarySchema>

type LibraryModalProps = IModalProps & {
	library?: ILib
	onDelete: () => void
	onUpdate: (item: string[]) => void
}

const OrderItem: FC<{ content: string, idx: number, removeItem: (idx: number) => void }> = ({ content, idx, removeItem }) => {
	return (
		<Draggable draggableId={content} index={idx}>
			{(provided) => (
				<div className={cn(styles.draggable, 'flex justify-between')}
					ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
					<div className="flex">
						<MenuIcon className={cn(styles.icon, 'mr-3')} />
						<p>{content}</p>
					</div>
					<TrashIcon className={styles['delete-icon']} onClick={() => removeItem(idx)} />
				</div>
			)}
		</Draggable>
	)
}

const LibraryModal: FC<LibraryModalProps> = ({ isOpen, onClose, library, onDelete, onUpdate }) => {
	const cancelButton = useRef<HTMLButtonElement>(null)
	const { register, handleSubmit, formState: { errors }, reset } = useForm<EditLibrarySchema>({
		resolver: yupResolver(editLibrarySchema)
	})
	const [order, setOrder] = useState(library?.content ?? [])

	function onDragEnd(result: DropResult) {
		if (result.source.index === result.destination?.index || !result.destination) return
		const [item] = order.splice(result.source.index, 1)
		order.splice(result.destination.index, 0, item)
		setOrder(order)
	}

	function removeItem(idx: number) {
		setOrder([...order.slice(0, idx), ...order.slice(idx + 1)])
	}

	function onSubmit(data: EditLibrarySchema) {
		setOrder(order.concat([library?.isKeyed ? `${data.code}: ${data.content}` : data.content]))
		reset()
	}

	// update state everytime the modal is opened: handles cases where an item is added but is not saved
	useEffect(() => { if (library) setOrder(library?.content); reset() }, [isOpen, library, reset])

	function handleClose() {
		onClose()
		setTimeout(reset, 500)
	}

	return (
		<Modal isOpen={isOpen} close={handleClose} initialFocus={cancelButton}>
			<div className={styles.panel}>
				<div className={styles.body}>
					<div className="flex justify-between items-center mb-3">
						<Dialog.Title as="h3" className={styles.title + ' !mb-0'}>{library?._id}</Dialog.Title>
						<button className={styles['delete-btn'] + ' btn red'} onClick={onDelete}>Delete</button>
					</div>
					<form id="update" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-10 gap-x-2 gap-y-1 mb-4">
						<div className={cn({ 'hidden': !library?.isKeyed }, 'col-span-full')}>
							<label htmlFor="code">Code</label>
							<input type={library?.isKeyed ? 'text' : 'hidden'} {...register('code')} id="code" defaultValue={library?.isKeyed ? '' : "0"} />
							<p className="form-err-msg text-sm">{errors.code?.message}</p>
						</div>
						<div className="col-span-9">
							<label htmlFor="content">Content</label>
							<input type="text" {...register('content')} id="content" />
							<p className="form-err-msg text-sm">{errors.content?.message}</p>
						</div>
						<div>
							<button type="submit" className="btn blue h-[2.4rem] aspect-square rounded-md mt-6">
								<PlusIcon className="h-3/4 m-auto" />
							</button>
						</div>
					</form>
					<DragDropContext onDragEnd={onDragEnd}>
						<Droppable droppableId="library-modal">
							{(provided) => (
								<div className={styles.droppable} ref={provided.innerRef} {...provided.droppableProps}>
									{order.map((c, i) =>
										<OrderItem key={i + c} content={c} idx={i} removeItem={removeItem} />
									)}
								</div>
							)}
						</Droppable>
					</DragDropContext>
				</div>
				<div className={styles.footer}>
					<button className={styles.btn + ' btn gray'} ref={cancelButton} onClick={handleClose}>Close</button>
					<button className={styles.btn + ' btn blue'} onClick={() => onUpdate(order)}>Save</button>
				</div>
			</div >
		</Modal >
	)
}

export default LibraryModal
