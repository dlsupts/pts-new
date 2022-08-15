import { Dispatch, FC, FormEventHandler, MouseEventHandler, SetStateAction, useState } from 'react'
import useStore, { RequestStore } from '@stores/request-store'
import SchedulePicker from '@components/schedule-picker'
import { days } from '@lib/times'
import { ISchedule } from '@models/schedule'
import shallow from 'zustand/shallow'
import { toast } from 'react-toastify'
import { toastErrorConfig } from '@lib/toast-defaults'
import Modal from '@components/modal'
import { Dialog } from '@headlessui/react'
import styles from '@styles/Modal.module.css'

type ScheduleProps = {
	setStep: Dispatch<SetStateAction<number>>
	dataPrivacy: string[]
}

const storeSelector = (state: RequestStore) => [state.tutee, state.setTutee] as const

const Schedule: FC<ScheduleProps> = ({ setStep, dataPrivacy }) => {
	const [tutee, setTutee] = useStore(storeSelector, shallow)
	const [isConfirmedChecked, setIsConfirmedChecked] = useState(false)
	const [isPrivacyChecked, setIsPrivacyChecked] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	const onPrevious: MouseEventHandler<HTMLButtonElement> = e => {
		e.preventDefault()
		setStep(x => --x)
	}

	const onSubmit: FormEventHandler<HTMLFormElement> = e => {
		e.preventDefault()

		if (!hasSelected()) {
			return toast.error('Please choose at least one free schedule.', toastErrorConfig)
		} else if (!isConfirmedChecked) {
			return toast.error('Please confirm your details by marking the first checkbox below.', toastErrorConfig)
		} else if (!isPrivacyChecked) {
			return toast.error('Please confirm your agreement with the data privacy policy by marking the second checkbox below.', toastErrorConfig)
		}

		setStep(x => ++x)
	}

	function setSched(schedule: ISchedule) {
		setTutee({ schedule })
	}

	function hasSelected() {
		for (const day of days) {
			if (tutee.schedule[day.key].length) {
				return true
			}
		}
		return false
	}

	return (
		<>
			<Modal isOpen={isOpen} close={() => setIsOpen(false)}>
				<div className={styles.panel}>
					<div className={styles.body}>
						<Dialog.Title as="h3" className={styles.title}>Data Privacy Policy</Dialog.Title>
						<div className="font-normal text-sm">
							<p>{dataPrivacy[0]}</p>
							<ol className="list-decimal ml-4 mt-4 space-y-4">
								{dataPrivacy.slice(1).map((item, i) => <li key={i}>{item}</li>)}
							</ol>
						</div>
					</div>
					<div className={styles.footer}>
						<button form="add-library" className={styles.btn + ' btn blue'} onClick={() => setIsOpen(false)}>Close</button>
					</div>
				</div>
			</Modal>
			<form className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-12" onSubmit={onSubmit}>
				<SchedulePicker sched={tutee.schedule} setSched={setSched} />
				<div className="flex col-span-full space-x-2 items-center mt-4">
					<input type="checkbox" id="correct" checked={isConfirmedChecked}
						onChange={() => setIsConfirmedChecked(x => !x)} />
					<label htmlFor="correct" className="max-w-prose select-none">
						I hereby declare that all statements contained in this application are true and correct, and I
						understand that false or inaccurate information in the application will lead to my disqualification.
					</label>
				</div>
				<div className="flex col-span-full space-x-2 items-center">
					<input type="checkbox" id="data-privacy" checked={isPrivacyChecked}
						onChange={() => setIsPrivacyChecked(x => !x)} />
					<label htmlFor="data-privacy">
						<span className="select-none">
							I have read and agree to the {' '}
						</span>
						<span className="cursor-pointer text-blue-700 hover:underline" onClick={(e) => {
							e.preventDefault()
							setIsOpen(true)
						}}>Data Privacy Policy</span>
					</label>
				</div>
				<div className="col-span-full flex justify-end mt-4">
					<button type="button" className="btn white rounded-md py-2 px-4 mr-2" onClick={onPrevious}>Previous</button>
					<input type="submit" className="btn blue rounded-md py-2 px-4" />
				</div>
			</form>
		</>
	)
}

export default Schedule
