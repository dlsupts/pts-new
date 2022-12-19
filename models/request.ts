import { Schema, models, model, Model, Document } from 'mongoose'
import { ITutee, TuteeSchema } from './tutee'
import { IUser } from './user'
import './tutee'
import tutorialTypes from '@lib/tutorial-types'
import { ISession, SessionSchema } from './session'

export interface IRequest {
	timestamp: Date
	ayterm: string
	duration: keyof typeof tutorialTypes
	tutorialType: string
	preferred: Schema.Types.ObjectId | IUser | null
	tutee: ITutee
	sessions: ISession[]
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
	tutee: { type: TuteeSchema, required: true },
	sessions: { type: [SessionSchema], required: true, minlength: 1 }
}, { versionKey: false })

export default models.Request as Model<IRequest & Document> || model<IRequest>('Request', requestSchema, 'requests')
