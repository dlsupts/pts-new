import create from 'zustand'
import { IRequest } from '@models/request'
import { ITutee } from '@models/tutee'

export type RequestFormData = Pick<IRequest, 'duration' | 'tutorialType' | 'earliestDate' | 'lastestDate'> & {
	preferred: string
}

export type RequestStore = {
	tutee: Omit<ITutee, '_id'>
	request: RequestFormData
	selectedSubjects: string[][]
	setTutee: (tutee: Partial<ITutee>) => void
	setRequest: (req: RequestFormData) => void
	setSelectedSubjects: (subs: string[][]) => void
	resetStore: () => void
}

const useRequestStore = create<RequestStore>(set => ({
	...getFreshStore(),
	setTutee: (tutee) => set(state => ({ tutee: { ...state.tutee, ...tutee } })),
	setRequest: (request) => set({ request }),
	setSelectedSubjects: (selectedSubjects) => set({ selectedSubjects }),
	resetStore: () => set(() => getFreshStore())
}))

function getFreshStore(): Pick<RequestStore, 'tutee' | 'request' | 'selectedSubjects'> {
	return {
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
			schedule: { M: [], T: [], W: [], H: [], F: [], S: [] },
		},
		request: {
			duration: 'One Session',
			tutorialType: 'One-on-one',
			preferred: '',
			earliestDate: undefined,
			lastestDate: undefined,
		},
		selectedSubjects: [],
	}
}

export default useRequestStore
