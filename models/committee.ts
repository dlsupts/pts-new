import { Schema, models, model, Model, Document } from 'mongoose'
import { IUser } from './user'
import './user' // force import in case of query population

export interface IOfficer {
	user: Schema.Types.ObjectId | IUser | string;
	name?: string; // frontend firstName + lastName
	position: string;
	image: string;
}

export interface ICommittee {
	_id: Schema.Types.ObjectId
	name: string;
	officers: IOfficer[];
}

const committeeSchema = new Schema<ICommittee>({
	name: { type: String, required: true },
	officers: [{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		position: { type: String, required: true },
		image: { type: String, required: true },
	}]
})

export default models.Committee as Model<ICommittee & Document> || model<ICommittee>('Committee', committeeSchema, 'committees')
