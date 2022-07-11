import { Dialog } from '@headlessui/react'
import { Dispatch, FC, SetStateAction, useRef } from 'react'
import Modal from '../modal'
import { filterSubjects, binInsert } from '../../lib/utils'

interface AddSubjectModalProps {
	isOpen: boolean
	setIsOpen: Dispatch<SetStateAction<boolean>>
	options: string[]
	selected: string[][]
	setSelected: Dispatch<SetStateAction<string[][]>> | ((sub: string[][]) => void)
}

const AddSubjectModal: FC<AddSubjectModalProps> = ({ isOpen, setIsOpen, options, selected, setSelected }) => {
	const closeModal = () => setIsOpen(false)
	const newSubject = useRef<HTMLSelectElement>(null)
	const newTopics = useRef<HTMLTextAreaElement>(null)

	const addSubject = () => {
		const subject = newSubject?.current?.value || ''
		const topic = newTopics?.current?.value || ''

		// verify if value is in list of subjects
		if (options.find(s => s == subject)) {
			const toSave = [subject.split(': ')[0].trim(), topic.trim()]
			binInsert(selected, toSave)
			setSelected(selected)
		}

		closeModal()
	}

	return (
		<Modal isOpen={isOpen} close={closeModal}>
			<div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
				<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<div className="sm:flex sm:items-start">
						<div className="mt-3 text-center sm:mt-0 sm:text-left">
							<Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">Add Subject</Dialog.Title>
							<div className="mt-4">
								<label className="text-left" htmlFor="new-subject">New Subject</label>
								<select ref={newSubject} id="new-subject">
									{filterSubjects(options, selected).map(o => <option key={o} value={o}>{o}</option>)}
								</select>
								<label htmlFor="specific-topics" className="mb-1 mt-4 text-left">Specific Topics</label>
								<textarea ref={newTopics} id="specific-topics" rows={3} className="shadow-sm w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"></textarea>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-row-reverse">
					<input value="Add" type="submit" onClick={addSubject} className="blue btn px-4 py-2 shadow-sm sm:w-auto sm:text-sm rounded-md font-medium" />
					<button type="button" onClick={closeModal} className="white btn px-4 py-2 rounded-md shadow-sm font-medium sm:mt-0 sm:w-auto sm:text-sm mx-3" > Cancel </button>
				</div>
			</div>
		</Modal>
	)
}

export default AddSubjectModal
