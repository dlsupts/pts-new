import { Schema, models, model, Model, Document } from 'mongoose'

export interface IDate {
	_id: string
	start: Date | string
	end: Date | string
}

const dateSchema = new Schema<IDate>({
	_id: { type: String, required: true },
	start: { type: Date, required: true },
	end: { type: Date, required: true }
})

export default models.Date as Model<IDate & Document> || model<IDate>('Date', dateSchema, 'dates')
