import { FC, Dispatch, SetStateAction } from 'react'
import { days, times, timeComparator, timeslot } from '../lib/times'
import { ISchedule } from '../models/schedule'
import Multiselect from 'multiselect-react-dropdown'

// sort schedule timeslots every time an option is selected
function handleScheduleSelect(selectedList: timeslot[], key: typeof days[number]['key'], schedule: ISchedule) {
	selectedList.sort(timeComparator)
	schedule[key] = selectedList // update schedule
}

function handleScheduleRemove(selectedList: timeslot[], key: typeof days[number]['key'], schedule: ISchedule) {
	schedule[key] = selectedList
}

function blockEnterKeyPress(e: KeyboardEvent) {
	if (e.key == 'Enter') e.preventDefault()
}

type SchedulePickerProps = {
	sched: ISchedule
	setSched?: Dispatch<SetStateAction<ISchedule>> | ((sched: ISchedule) => void)
}

const SchedulePicker: FC<SchedulePickerProps> = ({ sched, setSched }) => {
	return (
		<>
			{days.map(day => (
				<div className="col-span-full" key={day.key}>
					<label htmlFor={day.key + '_input'}>{day.text}</label>
					<Multiselect
						isObject={false}
						selectedValues={sched?.[day.key]}
						options={times}
						closeOnSelect={false}
						id={day.key}
						avoidHighlightFirstOption={true}
						placeholder="Add"
						closeIcon="cancel"
						onSelect={s => {
							handleScheduleSelect(s, day.key, sched)
							if (setSched) setSched(sched)
						}}
						onRemove={s => { 
							handleScheduleRemove(s, day.key, sched)
							if (setSched) setSched(sched) 
						}}
						onKeyPressFn={blockEnterKeyPress}
					/>
				</div>
			))
			}
		</>
	)
}

export default SchedulePicker
