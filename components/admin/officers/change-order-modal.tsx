import Modal from '@components/modal'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { MenuIcon } from '@heroicons/react/outline'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'

type ChangeOrderModalProps = {
	isOpen: boolean
	onClose: () => void
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
	const [order, setOrder] = useState(initOrder)

	useEffect(() => {
		if (order.length !== initOrder.length) setOrder(initOrder)
	}, [order, initOrder])

	const onDragEnd = useCallback((result: DropResult) => {
		if (result.source.index === result.destination?.index || !result.destination) return
		const [item] = order.splice(result.source.index, 1)
		order.splice(result.destination.index, 0, item)
		setOrder(order)
	}, [order])

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Modal isOpen={isOpen} close={onClose} initialFocus={cancelButton}>
				<div className="contents">
					<Droppable droppableId='order-committees'>
						{(provided) => (
							<div className="relative inline-block px-4 bg-white rounded-lg w-full text-left overflow-hidden shadow-xl transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
								ref={provided.innerRef} {...provided.droppableProps}>
								<h1 className="font-semibold text-xl my-4">Change Ordering</h1>

								<div className="grid gap-y-2 mb-4">
									{order.map((o, i) => <OrderItem key={o} name={o} idx={i} />)}
									{provided.placeholder}
								</div>

								<div className="flex items-center mb-4 justify-end">
									<button className="btn gray rounded-md px-4 py-2 mr-2" onClick={onClose} ref={cancelButton}>Cancel</button>
									<button onClick={() => onSubmit(order)} className="btn blue rounded-md px-4 py-2">Update</button>
								</div>
							</div>
						)}
					</Droppable>
				</div>
			</Modal>
		</DragDropContext>
	)
}

export default ChangeOrderModal
