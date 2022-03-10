import { Schema, models, model, Model, Document } from 'mongoose'
import { IUserInfo } from './user'

const userSchema = new Schema<IUserInfo>({
	firstName: { type: String, default: '' },
	middleName: { type: String, default: '' },
	lastName: { type: String, default: '' },
	idNumber: { type: Number, required: true },
	email: { type: String, required: true },
	course: { type: String, default: '' },
	contact: { type: String, default: '' },
	url: { type: String, default: '' },
	terms: { type: Number, default: 0 },
})

export default models.Application as Model<IUserInfo & Document> || model<IUserInfo>('Application', userSchema, 'applications')
