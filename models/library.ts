import { Schema, models, model, Model, Document } from 'mongoose'

export interface ILib {
	_id: string
	content: string[]
}

const libSchema = new Schema<ILib>({
	_id: { type: String, required: true },
	content: { type: [String], required: true, default: [] },
})

export default models.Library as Model<ILib & Document> || model<ILib>('Library', libSchema, 'libraries')
