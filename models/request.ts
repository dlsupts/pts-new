import { Schema, models, model, Model, Document } from 'mongoose'
import { ITutee } from './tutee'
import { IUser } from './user'
import './tutee'
import tutorialTypes from '@lib/tutorial-types'

export interface IRequest {
	timestamp: Date
	ayterm: string
	duration: keyof typeof tutorialTypes
	tutorialType: string
	preferred: Schema.Types.ObjectId | IUser | null
	tutee: Schema.Types.ObjectId | ITutee
}

const requestSchema = new Schema<IRequest>({
	timestamp: { type: Date, default: Date.now },
	ayterm: String,
	duration: String,
	tutorialType: String,
	preferred: {
		type: Schema.Types.ObjectId,
		ref: 'Account'
	},
	tutee: {
		type: Schema.Types.ObjectId,
		ref: 'Tutee'
	},
})

export default models.Request as Model<IRequest & Document> || model<IRequest>('Request', requestSchema, 'requests')
