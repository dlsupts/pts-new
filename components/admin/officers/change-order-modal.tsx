import Modal, { IModalProps } from '@components/modal'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { MenuIcon } from '@heroicons/react/outline'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import styles from '@styles/Modal.module.css'
import { Dialog } from '@headlessui/react'

type ChangeOrderModalProps = IModalProps & {
	onSubmit: (order: string[]) => void
	initOrder: string[]
}

const OrderItem: FC<{ name: string, idx: number }> = ({ name, idx }) => {
	return (
		<Draggable draggableId={name} index={idx}>
			{(provided) => (
				<div className="flex p-3 rounded-md bg-blue-50 hover:bg-blue-100 active:bg-blue-200"
					ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
					<MenuIcon className="w-6 mr-2 text-blue-400" />
					<p className="font-medium text-gray-900">{name}</p>
				</div>
			)}
		</Draggable>
	)
}

const ChangeOrderModal: FC<ChangeOrderModalProps> = ({ isOpen, onClose, onSubmit, initOrder }) => {
	const cancelButton = useRef<HTMLButtonElement>(null)
	const [order, setOrder] = useState([...initOrder])

	useEffect(() => {
		if (order.length !== initOrder.length) setOrder([...initOrder])
	}, [order, initOrder])

	const onDragEnd = useCallback((result: DropResult) => {
		if (result.source.index === result.destination?.index || !result.destination) return
		const [item] = order.splice(result.source.index, 1)
		order.splice(result.destination.index, 0, item)
		setOrder(order)
	}, [order])

	const onCancel = useCallback(() => {
		onClose()
		setTimeout(() => setOrder([...initOrder]), 500) // wait for modal to completely disappear before resetting
	}, [onClose, initOrder]) 

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Modal isOpen={isOpen} close={onClose} initialFocus={cancelButton}>
				<div className={styles.panel}>
					<Droppable droppableId='order-committees'>
						{(provided) => (
							<>
								<div className={styles.body}
									ref={provided.innerRef} {...provided.droppableProps}>
									<Dialog.Title as="h3" className={styles.title}>Change Ordering</Dialog.Title>

									<div className="grid gap-y-2 mb-4">
										{order.map((o, i) => <OrderItem key={o} name={o} idx={i} />)}
										{provided.placeholder}
									</div>
								</div>

								<div className={styles.footer}>
									<button className={styles.btn + ' btn gray'} onClick={onCancel} ref={cancelButton}>Cancel</button>
									<button className={styles.btn + ' btn blue'} onClick={() => onSubmit(order)}>Update</button>
								</div>
							</>
						)}
					</Droppable>
				</div>
			</Modal>
		</DragDropContext>
	)
}

export default ChangeOrderModal
