import { Schema, models, model, Model, Document } from 'mongoose'
import { role, service } from '../types'
import * as yup from 'yup'

// this is extended by tutee schema, be careful of changes
export const userInfoSchema = yup.object({
	idNumber: yup.number().typeError('ID number is required.').required().min(11500000, 'Invalid ID number.').integer(),
	email: yup.string().trim().email().matches(/.*(@dlsu.edu.ph)$/, 'Should end with "@dlsu.edu.ph".').required('Email is required.'),
	firstName: yup.string().trim().required('First name is required.'),
	middleName: yup.string().trim(),
	lastName: yup.string().trim().required('Last name is required.'),
	course: yup.string().required('Course is required.'),
	terms: yup.number().typeError('Remaining terms is required.').positive('Input should be positive.').required('Remaining terms in required.').integer(),
	contact: yup.string().trim().matches(/\d*/, 'Only numerical input is allowed.').required('Contact number is required.'),
	url: yup.string().trim().url('Invalid URL.').required('Facebook URL is required.'),
}).required()

export type IUserInfo = yup.InferType<typeof userInfoSchema>

export interface ITutorInfo {
	membership: boolean
	tutoringService: service
	tutorialType: string[]
	tuteeCount: number
	maxTuteeCount: number
	topics: string[][],
	schedule: Schema.Types.ObjectId
}

export interface IUser extends IUserInfo, ITutorInfo {
	_id: Schema.Types.ObjectId
	userType: role
	reset: boolean
}

const userSchema = new Schema<IUser>({
	firstName: { type: String, default: '' },
	middleName: { type: String },
	lastName: { type: String, default: '' },
	idNumber: { type: Number, required: true },
	email: { type: String, required: true },
	course: { type: String, default: '' },
	contact: { type: String, default: '' },
	url: { type: String, default: '' },
	terms: { type: Number, default: 0 },
	membership: { type: Boolean, default: true },
	tutoringService: [String], /* [WHOLE TERM, ONE SESSION] */
	tutorialType: [String],
	tuteeCount: { type: Number, default: 0 },
	maxTuteeCount: { type: Number, default: 0 },
	topics: [[String]],
	schedule: {
		type: Schema.Types.ObjectId,
		ref: 'Schedule',
	},
	userType: String, /* [ADMIN, TUTOR] */
	reset: Boolean,
})

export default models?.User as Model<IUser & Document> || model<IUser>('User', userSchema, 'users')
