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
	M: { type: [String], default: [] },
	T: { type: [String], default: [] },
	W: { type: [String], default: [] },
	H: { type: [String], default: [] },
	F: { type: [String], default: [] },
	S: { type: [String], default: [] },
})

export default models?.Schedule as Model<ISchedule & Document> || model<ISchedule>('Schedule', libSchema, 'schedules')
