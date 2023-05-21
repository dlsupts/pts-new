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
		.group({
			_id: '$_id.subject',
			count: { $max: '$count' },
			tutors: {
				$push: {
					tutor: '$_id.tutor',
					count: '$count'
				}
			}
		})
		.addFields({
			tutors: {
				$filter: {
					input: '$tutors',
					as: 'tutor',
					cond: { $eq: ['$count', '$$tutor.count'] }
				}
			}
		})
		.lookup({
			from: "users",
			localField: "tutors.tutor",
			foreignField: "_id",
			as: "tutors",
		})
		.addFields({
			tutors: {
				$substr: [{
					$reduce: {
						input: '$tutors',
						initialValue: '',
						in: { $concat: ['$$value', ', ', "$$this.firstName", " ", "$$this.lastName"] }
					}
				}, 2, -1]
			},
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
