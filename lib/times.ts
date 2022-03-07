export const times = [
	'07:30 AM - 09:00 AM',
	'09:15 AM - 10:45 AM',
	'11:00 AM - 12:30 PM',
	'12:45 PM - 14:15 PM',
	'14:30 PM - 16:00 PM',
	'16:15 PM - 17:45 PM',
	'18:00 PM - 19:30 PM',
] as const

export type timeslot = typeof times[number]

export const days = [
	{ key: 'M', text: 'Monday' },
	{ key: 'T', text: 'Tuesday' },
	{ key: 'W', text: 'Wednesday' },
	{ key: 'H', text: 'Thursday' },
	{ key: 'F', text: 'Friday' },
	{ key: 'S', text: 'Saturday' }
] as const

type order_mapping = {
	[key in timeslot]: number
}

const ordering = 
	times.map((s: timeslot, i) => ({ [s]: i }))
		.reduce((prev, curr) => Object.assign(prev, curr), {}) as order_mapping

export function timeComparator(a: timeslot, b: timeslot) {
	console.log('a', a, ordering[a])
	console.log('b', b, ordering[b])
	return ordering[a] - ordering[b]
}
