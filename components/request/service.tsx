import { FC, MouseEventHandler, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSWRImmutable from 'swr/immutable'
import app from '../../lib/axios-config'
import LoadingSpinner from '../loading-spinner'
import SubjectList from '../subject-list/list'
import AddSubjectModal from '../subject-list/modal'
import useStore from '../../stores/request-store'

type ServiceProps = {
	types: string[]
	subjects: string[]
	services: string[]
}

type PreferredTutor = {
	firstName: string
	lastName: string
	topics: string[][]
}

type ServiceFormData = {
	duration: string
	type: string
	preferred: string
}

function useAvailableTutors() {
	const { data, error } = useSWRImmutable('/api/tutors?filter=preference', url => app.get<PreferredTutor[]>(url))

	return {
		tutors: data?.data,
		isLoading: !data && !error,
		isError: !!error
	}
}

const Service: FC<ServiceProps> = ({ types, subjects, services }) => {
	const { handleSubmit } = useForm<ServiceFormData>()
	const { tutors, isLoading } = useAvailableTutors()
	const [isOpen, setIsOpen] = useState(false)	// for add subject modal
	const [selectedSubjects, setSelectedSubjects] = useState<string[][]>([])
	const { tutee, setTutee } = useStore()

	const handleAddClick: MouseEventHandler = e => {
		e.preventDefault()
		setIsOpen(true)
	}

	const onSubmit = (data: ServiceFormData) => {
		console.log(data)
	}

	if (isLoading) {
		return <LoadingSpinner className="" />
	}

	return (
		<>
			<AddSubjectModal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				options={subjects}
				selected={selectedSubjects}
				setSelected={setSelectedSubjects}
			/>
			<form className="grid grid-cols-2 gap-4 mt-8" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label htmlFor="duration">Tutoring Duration<span className="text-red-500">*</span></label>
					<select id="duration" className="form-select mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
						{services.map(s => <option key={s} value={s}>{s}</option>)}
					</select>
				</div>
				<div>
					<label htmlFor="type">Tutorial Type<span className="text-red-500">*</span></label>
					<select id="type" className="">
						{types.map(t => <option key={t} value={t}>{t}</option>)}
					</select>
				</div>
				<div className="col-span-full">
					<label htmlFor="preferred">Preferred Tutor<span className="text-red-500">*</span></label>
					<select id="preferred">
						<option selected value="None">None</option>
						{tutors?.map(t => {
							const name = t.firstName + ' ' + t.lastName
							return <option key={name}>{name}</option>
						})}
					</select>
				</div>
				<div className="col-span-full mt-8 flex justify-between items-center">
					<div>
						<p className="text-lg font-bold">Subject List<span className="text-red-500">*</span></p>
						<p className="text-gray-500 text-sm">Add subjects that you need help with</p>
					</div>
					<button title="Add subject" className="btn gray px-3 py-2 rounded-full" onClick={handleAddClick}>
						<i className="fa-solid fa-plus fa-lg text-white"></i>
					</button>
				</div>
				<div className="col-span-full">
					<SubjectList subjects={selectedSubjects} setSubjects={setSelectedSubjects} />
				</div>
				<div className="col-span-full flex justify-end">
					<input className="btn blue rounded-md px-4 py-2" type="submit" value="Next" disabled={!selectedSubjects.length} />
				</div>
			</form>
		</>
	)
}

export default Service
