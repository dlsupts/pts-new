import { Dialog } from '@headlessui/react'
import { Dispatch, FC, FormEventHandler, SetStateAction } from 'react'
import Modal from '../modal'
import { filterSubjects, binInsert } from '@lib/utils'
import styles from '@styles/Modal.module.css'

interface AddSubjectModalProps {
	isOpen: boolean
	close: () => void
	options: string[]
	selected: string[][]
	setSelected: Dispatch<SetStateAction<string[][]>> | ((sub: string[][]) => void)
}

const AddSubjectModal: FC<AddSubjectModalProps> = ({ isOpen, close, options, selected, setSelected }) => {
	const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
		e.preventDefault()
		const { subject, topics } = Object.fromEntries(new FormData(e.target as HTMLFormElement))

		if (subject instanceof File || topics instanceof File) return

		// verify if value is in list of subjects
		if (options.find(s => s == subject)) {
			const toSave = [subject.split(': ')[0], topics.trim()]
			binInsert(selected, toSave)
			setSelected(selected)
		}

		close()
	}

	return (
		<Modal isOpen={isOpen} close={close}>
			<form className={styles.panel} onSubmit={handleSubmit}>
				<div className={styles.body}>
					<Dialog.Title as="h3" className={styles.title}>Add Subject</Dialog.Title>
					<label className="text-left" htmlFor="new-subject">New Subject</label>
					<select id="new-subject" name="subject">
						{filterSubjects(options, selected).map(o => <option key={o} value={o}>{o}</option>)}
					</select>
					<label htmlFor="specific-topics" className="mb-1 mt-4 text-left">Specific Topics</label>
					<textarea id="specific-topics" rows={3} name="topics"
						className="shadow-sm w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
					/>
				</div>
				<div className={styles.footer}>
					<button type="button" onClick={close} className={styles.btn + ' btn white'}>Cancel</button>
					<input value="Add" type="submit" className={styles.btn + ' btn blue'} />
				</div>
			</form>
		</Modal>
	)
}

export default AddSubjectModal
