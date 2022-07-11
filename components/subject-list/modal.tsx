import { Dialog } from '@headlessui/react'
import { Dispatch, FC, SetStateAction, useRef } from 'react'
import Modal from '../modal'
import { filterSubjects, binInsert } from '@lib/utils'
import styles from '@styles/Modal.module.css'

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
			<div className={styles.panel}>
				<div className={styles.body}>
					<Dialog.Title as="h3" className={styles.title}>Add Subject</Dialog.Title>
					<label className="text-left" htmlFor="new-subject">New Subject</label>
					<select ref={newSubject} id="new-subject">
						{filterSubjects(options, selected).map(o => <option key={o} value={o}>{o}</option>)}
					</select>
					<label htmlFor="specific-topics" className="mb-1 mt-4 text-left">Specific Topics</label>
					<textarea ref={newTopics} id="specific-topics" rows={3} className="shadow-sm w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"></textarea>
				</div>
				<div className={styles.footer}>
					<button type="button" onClick={closeModal} className={styles.btn + ' btn white'}> Cancel </button>
					<input value="Add" type="submit" onClick={addSubject} className={styles.btn + ' btn blue'} />
				</div>
			</div>
		</Modal>
	)
}

export default AddSubjectModal
