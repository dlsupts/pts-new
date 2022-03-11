import create from 'zustand'
import { ITutee } from '../models/tutee'

type RequestStore = {
	tutee: ITutee
	setTutee: (tutee: Partial<ITutee>) => void
}

const useRequestStore = create<RequestStore>(set => ({
	tutee: {
		campus: '',
		firstName: '',
		lastName: '',
		idNumber: 0,
		email: '',
		college: '',
		course: '',
		contact: '',
		url: '',
		friends: [],
		schedule: [],
	},
	setTutee: (tutee) => set(state => ({ tutee: { ...state.tutee, ...tutee } }))
}))

export default useRequestStore
