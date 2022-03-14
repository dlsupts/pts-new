import create from 'zustand'
import { IRequest } from '../models/request'
import { ITutee } from '../models/tutee'

type RequestFormData = Pick<IRequest, 'duration' | 'tutorialType'> & {
	preferred: string
}

type RequestStore = {
	tutee: ITutee
	request: RequestFormData
	selectedSubjects: string[][]
	setTutee: (tutee: Partial<ITutee>) => void
	setRequest: (req: RequestFormData) => void
	setSelectedSubjects: (subs: string[][]) => void
}

const useRequestStore = create<RequestStore>(set => ({
	tutee: {
		campus: 'TAFT',
		firstName: '',
		lastName: '',
		idNumber: 0,
		email: '',
		college: 'CCS',
		course: '',
		contact: '',
		url: '',
		friends: [],
		schedule: { M: [], T: [], W: [], H: [], F: [], S: []},
	},
	request: {
		duration: 'One Session',
		tutorialType: 'One-on-one',
		preferred: '',
	},
	selectedSubjects: [],
	setTutee: (tutee) => set(state => ({ tutee: { ...state.tutee, ...tutee } })),
	setRequest: (request) => set({ request }),
	setSelectedSubjects: (selectedSubjects) => set({ selectedSubjects })
}))

export default useRequestStore
