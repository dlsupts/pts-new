import User from '@models/user'
import Request from '@models/request'

export type Aggregate = {
	_id: string
	count: number
	[key: string]: unknown
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
	return await Request.aggregate().group({
		_id: { $substrCP: ['$tutee.idNumber', 0, 3] },
		count: { $sum: 1 }
	})
		.sort({ _id: 1 }) as Aggregate[]
}

export async function groupTuteesByCollege() {
	return await Request.aggregate().group({
		_id: '$tutee.college',
		count: { $sum: 1 }
	})
		.sort({ _id: 1 }) as Aggregate[]
}

export async function groupSessionsbySubjectAndStatus() {
	return await Request.aggregate()
		.project({ sessions: 1 })
		.unwind('sessions')
		.replaceRoot('sessions')
		.group({
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

export async function getTopTutorPerSubject() {
	return await Request.aggregate()
		.unwind('sessions')
		.match({ "sessions.tutor": { $ne: null } })
		.group({
			_id: {
				subject: "$sessions.subject",
				tutor: "$sessions.tutor"
			},
			count: { $sum: 1 }
		})
		.sort({ count: -1 }) // sort first so that the $first operator in group will get the max
		.group({
			_id: '$_id.subject',
			count: { $first: '$count' },
			tutor: { $first: '$_id.tutor' }
		})
		.lookup({ // get tutor first and last name
			from: 'users',
			localField: 'tutor',
			foreignField: '_id',
			as: 'tutor'
		})
		.addFields({
			tutor: {
				$concat: [
					{ $arrayElemAt: ['$tutor.firstName', 0] },
					' ',
					{ $arrayElemAt: ['$tutor.lastName', 0] }
				]
			}
		})
}

const statistics = {
	groupTutorsByIdNumber,
	groupTutorsByCourse,
	groupTuteesByIdNumber,
	groupTuteesByCollege,
	groupSessionsbySubjectAndStatus,
	getTopTutorPerSubject,
}

export default statistics
