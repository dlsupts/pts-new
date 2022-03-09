import { Schema, models, model, Model, Document } from 'mongoose'
import { role, service } from '../types'

export interface IUserInfo {
	firstName: string
	middleName: string
	lastName: string
	idNumber: string
	email: string
	course: string
	contact: string
	url: string
	terms: number
}

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
	middleName: { type: String, default: '' },
	lastName: { type: String, default: '' },
	idNumber: { type: String, default: '' },
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

export default models.User as Model<IUser & Document> || model<IUser>('User', userSchema, 'users')
