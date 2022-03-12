import { Schema, models, model, Model, Document } from 'mongoose'
import { ISchedule } from './schedule'

export interface ITutee {
	campus: string
	firstName: string
	lastName: string
	idNumber: number
	email: string
	college: string
	course: string
	contact: string
	url: string
	friends: string[]
	schedule: Schema.Types.ObjectId | ISchedule
}

const tuteeSchema = new Schema<ITutee>({
	campus: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	idNumber: { type: Number, required: true },
	email: { type: String, required: true },
	college: { type: String, required: true },
	course: { type: String, required: true },
	contact: { type: String, required: true },
	url: { type: String, required: true },
	friends: [String],
	schedule: {
		type: Schema.Types.ObjectId,
		ref: 'Schedule',
	}
})

export default models.Tutee as Model<ITutee & Document> || model<ITutee>('Tutee', tuteeSchema, 'tutees')
