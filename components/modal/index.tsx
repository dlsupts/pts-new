import { Fragment, useRef, Dispatch, SetStateAction, RefObject } from 'react'
import { Dialog, Transition } from '@headlessui/react'

type ModalProps = {
	isOpen: boolean,
	close: (() => void) | Dispatch<SetStateAction<boolean>>
	children:React.ReactNode
	initialFocus?: RefObject<HTMLButtonElement>
}

export interface IModalProps {
	isOpen: boolean
	onClose: () => void
}

const Modal = ({ isOpen, close, children, initialFocus }:ModalProps) => {
	const cancelButtonRef = useRef(null)

	return (
		<Transition.Root show={isOpen} as={Fragment}>
			<Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" initialFocus={initialFocus || cancelButtonRef} onClose={close}>
				<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						{children}
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

export default Modal
