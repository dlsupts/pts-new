import { Schema, models, model, Model, ObjectId } from 'mongoose'
import { ITutee, TuteeSchema } from './tutee'
import { IUser } from './user'
import tutorialTypes from '@lib/tutorial-types'
import { ISession, SessionSchema } from './session'
import { MongoID } from '@types'

export interface IRequest {
	_id: MongoID
	timestamp: Date
	ayterm: string
	duration: keyof typeof tutorialTypes
	tutorialType: string
	preferred: ObjectId | IUser | null
	tutee: ITutee
	sessions: ISession[]
	earliestDate?: Date
	latestDate?: Date
	emailSent: boolean
}

export interface RequestModel extends Model<IRequest> {
	isHandledByTutor(requestId: MongoID, tutorId: MongoID): Promise<boolean>
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
	earliestDate: { type: Date },
	latestDate: { type: Date },
	tutee: { type: TuteeSchema, required: true },
	sessions: { type: [SessionSchema], required: true, minlength: 1 },
	emailSent: { type: Boolean, required: true, deafult: false }
}, { versionKey: false })

requestSchema.statics.isHandledByTutor = async function (requestId: MongoID, tutorId: MongoID): Promise<boolean> {
	return await this.exists({ _id: requestId, 'sessions.tutor': tutorId }) != null
}

export default models?.Request as unknown as RequestModel || model<IRequest, RequestModel>('Request', requestSchema, 'requests')
