import { Schema, models, model, Model, Document } from 'mongoose'

export interface ISchedule {
	M: string[]
	T: string[]
	W: string[]
	H: string[]
	F: string[]
	S: string[]
}

const libSchema = new Schema<ISchedule>({
	M: [String],
	T: [String],
	W: [String],
	H: [String],
	F: [String],
	S: [String]
})

export default models?.Schedule as Model<ISchedule & Document> || model<ISchedule>('Schedule', libSchema, 'schedules')
