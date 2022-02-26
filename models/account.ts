import { Schema, models, model, Model, Document } from 'mongoose'

export interface IAccount {
	_id: Schema.Types.ObjectId
	firstname: string
	middlename: string
	lastname: string
	username: string
	idNumber: string
	email: string
	course: string
	contact: string
	url: string
	terms: number
	membership: boolean
	tutoringService: 'WHOLE TERM' | 'ONE SESSION'
	tutorialType: string[]
	tuteeCount: number
	maxTuteeCount: number
	topics: string[][],
	schedule: Schema.Types.ObjectId
	userType: 'ADMIN' | 'TUTOR'
	reset: boolean
}

const accountSchema = new Schema({
	firstname: { type: String, required: true },
	middlename: { type: String, required: true },
	lastname: { type: String, required: true },
	username: { type: String, required: true },
	idNumber: { type: String, required: true },
	email: { type: String, required: true },
	course: { type: String, required: true },
	contact: { type: String, required: true },
	url: { type: String, required: true },
	terms: { type: Number, required: true },
	membership: { type: Boolean, required: true },
	tutoringService: [String], /* [WHOLE TERM, ONE SESSION] */
	tutorialType: [String],
	tuteeCount: { type: Number, required: true, default: 0 },
	maxTuteeCount: { type: Number, required: true, default: 0 },
	topics: [[String]],
	schedule: {
		type: Schema.Types.ObjectId,
		ref: 'Schedule',
	},
	userType: String, /* [ADMIN, TUTOR] */
	reset: Boolean,
})

export default models.Account as Model<IAccount & Document> || model<IAccount>('Account', accountSchema, 'accounts')
