// SUBDOCUMENT SCHEMA
import { Schema } from 'mongoose'
import { ISchedule } from './schedule'
import { userInfoSchema, IUserInfo } from './user'
import { string } from 'yup'
import { ScheduleSchema } from './schedule'

export const tuteeInfoSchema = userInfoSchema.shape({
	campus: string().required('Campus is required.'),
	college: string().required('College is required.'),
}).omit(['terms', 'middleName']).required()

export interface ITutee extends Omit<IUserInfo, | 'terms' | 'middleName'> {
	campus: string
	college: string
	schedule: ISchedule
	friends?: string[]
}

export const TuteeSchema = new Schema<ITutee>({
	campus: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	idNumber: { type: Number, required: true },
	email: { type: String, required: true },
	college: { type: String, required: true },
	course: { type: String, required: true },
	contact: { type: String, required: true },
	url: { type: String, required: true },
	friends: [String],
	schedule: { type: ScheduleSchema }
}, { _id: false, versionKey: false })
