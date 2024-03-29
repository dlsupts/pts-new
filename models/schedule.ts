// SUBDOCUMENT SCHEMA
import { Schema, model, models, Model } from 'mongoose'

export interface ISchedule {
	M: string[]
	T: string[]
	W: string[]
	H: string[]
	F: string[]
	S: string[]
}

export const ScheduleSchema = new Schema<ISchedule>({
	M: { type: [String], default: [] },
	T: { type: [String], default: [] },
	W: { type: [String], default: [] },
	H: { type: [String], default: [] },
	F: { type: [String], default: [] },
	S: { type: [String], default: [] },
}, { _id: false, versionKey: false })

export const Schedule = models?.Schedule as Model<ISchedule> ?? model('Schedule', ScheduleSchema)
