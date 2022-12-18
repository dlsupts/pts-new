// SUBDOCUMENT SCHEMA
import { Schema } from 'mongoose'
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

export const SessionSchema = new Schema<ISession>({
	subject: { type: String, required: true, trim: false },
	topics: { type: String, trim: true },
	tutor: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	status: { type: String, required: true, default: 'Pending' },
}, { _id: false, versionKey: false })
