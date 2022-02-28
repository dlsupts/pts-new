import { Schema, models, model, Model, Document } from 'mongoose'

export interface IUser {
	_id: Schema.Types.ObjectId
	firstname: string
	middlename: string
	lastname: string
	idNumber: string
	email: string
	course: string
	contact: string
	url: string
	terms: number
	membership: boolean
	tutoringService: ('WHOLE TERM' | 'ONE SESSION')[]
	tutorialType: string[]
	tuteeCount: number
	maxTuteeCount: number
	topics: string[][],
	schedule: Schema.Types.ObjectId
	userType: 'ADMIN' | 'TUTOR'
	reset: boolean
}

const userSchema = new Schema({
	firstname: { type: String, default: '' },
	middlename: { type: String, default: '' },
	lastname: { type: String, default: '' },
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
