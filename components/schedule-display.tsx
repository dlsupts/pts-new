import { days } from '@lib/times'
import { ISchedule } from '@models/schedule'
import cn from 'classnames'

export default function ScheduleDisplay({ schedule }: { schedule?: ISchedule }) {
	return (
		<table className="w-full shadow-sm">
			<tbody>
				{days.map((day, index) => (
					<tr key={day.key} className={cn({ 'bg-gray-100': index % 2 })}>
						<td className="font-medium pl-2 py-2 sm:pl-6 w-32 sm:w-36">{day.text}</td>
						<td className="py-2" dangerouslySetInnerHTML={{ __html: schedule?.[day.key].join('<br>') || '' }} />
					</tr>
				))
				}
			</tbody>
		</table>
	)
}
