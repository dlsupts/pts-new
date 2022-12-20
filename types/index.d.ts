import { ObjectId } from 'mongoose'

export type role = 'ADMIN' | 'TUTOR'
export type session_status = 'Matched' | 'Pending' | 'No Match'
export type service = ('Whole Term' | 'One Session')[] | 'None'[]
export type MongoID = ObjectId | string
