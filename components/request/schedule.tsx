import { Dispatch, FC, FormEventHandler, MouseEventHandler, SetStateAction } from 'react'
import useStore, { RequestStore } from '../../stores/request-store'
import SchedulePicker from '../schedule-picker'
import { days } from '../../lib/times'
import { ISchedule } from '../../models/schedule'
import shallow from 'zustand/shallow'

type ScheduleProps = {
	setStep: Dispatch<SetStateAction<number>>
}

const storeSelector = (state: RequestStore) => [state.tutee, state.setTutee] as const

const Schedule: FC<ScheduleProps> = ({ setStep }) => {
	const [tutee, setTutee] = useStore(storeSelector, shallow)

	const onPrevious: MouseEventHandler<HTMLButtonElement> = e => {
		e.preventDefault()
		setStep(x => --x)
	}

	const onSubmit: FormEventHandler<HTMLFormElement> = e => {
		e.preventDefault()
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
			<form className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-12" onSubmit={onSubmit}>
				<SchedulePicker sched={tutee.schedule} setSched={setSched} />
				<div className="col-span-full flex justify-end mt-4">
					<button type="button" className="btn white rounded-md py-2 px-4 mr-2" onClick={onPrevious}>Previous</button>
					<input type="submit" className="btn blue rounded-md py-2 px-4" disabled={!hasSelected()} />
				</div>
			</form>
		</>
	)
}

export default Schedule
