import User from '@models/user'
import Tutee from '@models/tutee'
import Session from '@models/session'

export type Aggregate = {
	_id: string
	count: number
}

export type ComplexAggregate = {
	_id: Record<string, unknown>
	count: number
}

export async function groupTutorsByIdNumber() {
	return await User.aggregate()
		.match({ email: { $ne: process.env.NEXT_PUBLIC_ADMIN_EMAIL } })
		.group({
			_id: { $substrCP: ['$idNumber', 0, 3] },
			count: { $sum: 1 }
		})
		.sort({ _id: 1 }) as Aggregate[]
}

export async function groupTutorsByCourse() {
	return await User.aggregate()
		.match({ email: { $ne: process.env.NEXT_PUBLIC_ADMIN_EMAIL } })
		.group({
			_id: '$course',
			count: { $sum: 1 }
		})
		.sort({ _id: 1 }) as Aggregate[]
}

export async function groupTuteesByIdNumber() {
	return await Tutee.aggregate().group({
		_id: { $substrCP: ['$idNumber', 0, 3] },
		count: { $sum: 1 }
	})
		.sort({ _id: 1 }) as Aggregate[]
}

export async function groupTuteesByCollege() {
	return await Tutee.aggregate().group({
		_id: '$college',
		count: { $sum: 1 }
	})
		.sort({ _id: 1 }) as Aggregate[]
}

export async function groupSessionsbySubjectAndStatus() {
	return await Session.aggregate().group({
		_id: {
			subject: '$subject',
			matched: {
				$cond: {
					if: '$tutor',
					then: true,
					else: false,
				}
			}
		},
		count: { $sum: 1 }
	})
		.sort({ _id: 1 }) as ComplexAggregate[]
}

const statistics = {
	groupTutorsByIdNumber,
	groupTutorsByCourse,
	groupTuteesByIdNumber,
	groupTuteesByCollege,
	groupSessionsbySubjectAndStatus,
}

export default statistics
