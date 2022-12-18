import { Schema, models, model, Model, Document } from 'mongoose'
import { role, service } from '../types'
import * as yup from 'yup'
import { ISchedule, ScheduleSchema } from './schedule'

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
	url: yup.string().trim().url('Must include "https://"').matches(/facebook.com\/\w+/, 'Invalid format!').required('Facebook URL is required.'),
}).required()

export interface IUserInfo extends yup.InferType<typeof userInfoSchema> {
	_id: Schema.Types.ObjectId
}

export interface ITutorInfo {
	membership: boolean
	tutoringService: service
	tutorialType: string[]
	tuteeCount: number
	maxTuteeCount: number
	topics: string[][],
	schedule: Schema.Types.ObjectId | ISchedule
}

export interface IUser extends IUserInfo, ITutorInfo { 
	userType: role
	reset: boolean
	lastActive: string
	// takes the value of lastActive upon term reset. This serves as a backup value when lastActive is updated, but has to be reset
	// use case: a user has set his max tutee > 0, so lastActive is set to the current term. However, he later changes it back to 0,
	// so the value of lastActive will now be reset to the value stored in storedLastActive
	storedLastActive: string
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
	tutoringService: [String], // [WHOLE TERM, ONE SESSION]
	tutorialType: [String],
	tuteeCount: { type: Number, default: 0 },
	maxTuteeCount: { type: Number, default: 0 },
	topics: [[String]],
	schedule: { type: ScheduleSchema, required: true },
	userType: String, 	// [ADMIN, TUTOR]
	reset: Boolean,
	lastActive: String, // ayterm
})

export default models?.User as Model<IUser & Document> || model<IUser>('User', userSchema, 'users')
