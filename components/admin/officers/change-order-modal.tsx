import Modal, { IModalProps } from '@components/modal'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { MenuIcon } from '@heroicons/react/outline'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import styles from '@styles/Modal.module.css'
import { Dialog } from '@headlessui/react'
import LoadingButton from '@components/loading-button'

type ChangeOrderModalProps = IModalProps & {
	onSubmit: (order: string[]) => Promise<void>
	initOrder: string[]
}

const OrderItem: FC<{ name: string, idx: number }> = ({ name, idx }) => {
	return (
		<Draggable draggableId={name} index={idx}>
			{(provided) => (
				<div className={styles.draggable + ' flex'}
					ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
					<MenuIcon className={styles.icon + ' mr-2'} />
					<p>{name}</p>
				</div>
			)}
		</Draggable>
	)
}

const ChangeOrderModal: FC<ChangeOrderModalProps> = ({ isOpen, onClose, onSubmit, initOrder }) => {
	const cancelButton = useRef<HTMLButtonElement>(null)
	const [order, setOrder] = useState([...initOrder])
	const [isLoading, setIsLoading] = useState(false)

	async function handleSubmit() {
		setIsLoading(true)
		await onSubmit(order)
		setIsLoading(false)
	}

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
								<div className={styles.body} ref={provided.innerRef} {...provided.droppableProps}>
									<Dialog.Title as="h3" className={styles.title}>Change Ordering</Dialog.Title>

									<div className={styles.droppable}>
										{order.map((o, i) => <OrderItem key={o} name={o} idx={i} />)}
										{provided.placeholder}
									</div>
								</div>

								<div className={styles.footer}>
									<button className={styles.btn + ' btn gray'} onClick={onCancel} ref={cancelButton} disabled={isLoading}>Cancel</button>
									<LoadingButton className={styles.btn + ' btn blue'} onClick={handleSubmit} isLoading={isLoading}>Update</LoadingButton>
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
