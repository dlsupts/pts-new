import { Schema, models, model, Model, Document } from 'mongoose'
import { session_status } from '../types'
import { IRequest } from './request'
import { IUser } from './user'

export interface ISession {
	_id: Schema.Types.ObjectId
	request: Schema.Types.ObjectId | IRequest
	subject: string
	topics: string
	tutor?: Schema.Types.ObjectId | IUser
	status: session_status
}

const sessionSchema = new Schema<ISession>({
	request: {
		type: Schema.Types.ObjectId,
		ref: 'Request'
	},
	subject: { type: String, required: true, trim: true },
	topics: { type: String, trim: true },
	tutor: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	status: { type: String, required: true, default: 'Pending' },
})

export default models.Session as Model<ISession & Document> || model<ISession>('Session', sessionSchema, 'sessions')
