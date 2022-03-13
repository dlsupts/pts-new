import { Dispatch, FC, MouseEventHandler, SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSWRImmutable from 'swr/immutable'
import app from '../../lib/axios-config'
import LoadingSpinner from '../loading-spinner'
import SubjectList from '../subject-list/list'
import AddSubjectModal from '../subject-list/modal'
import useStore from '../../stores/request-store'
import { IUser } from '../../models/user'

type ServiceProps = {
	types: string[]
	subjects: string[]
	services: string[]
	setStep: Dispatch<SetStateAction<number>>
}

type PreferredTutor = Pick<IUser, '_id' | 'firstName' | 'lastName' | 'topics'>

function useAvailableTutors() {
	const { data, error } = useSWRImmutable('/api/tutors?filter=preference', url => app.get<PreferredTutor[]>(url))

	return {
		tutors: data?.data,
		isLoading: !data && !error,
		isError: !!error
	}
}

const Service: FC<ServiceProps> = ({ types, subjects, services, setStep }) => {
	const { request, setRequest, selectedSubjects, setSelectedSubjects } = useStore()
	const { register, handleSubmit } = useForm<typeof request>({
		defaultValues: request
	})
	const { tutors, isLoading } = useAvailableTutors()
	const [isOpen, setIsOpen] = useState(false)	// for add subject modal

	const handleAddClick: MouseEventHandler = e => {
		e.preventDefault()
		setIsOpen(true)
	}

	const onSubmit = (values: typeof request) => {
		setRequest(values)
		setStep(x => ++x) // move to next page
	}

	if (isLoading) {
		return <LoadingSpinner />
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
					<select {...register('duration')} id="duration">
						{services.map(s => <option key={s} value={s}>{s}</option>)}
					</select>
				</div>
				<div>
					<label htmlFor="type">Tutorial Type<span className="text-red-500">*</span></label>
					<select id="type" {...register('tutorialType')}>
						{types.map(t => <option key={t} value={t}>{t}</option>)}
					</select>
				</div>
				<div className="col-span-full">
					<label htmlFor="preferred">Preferred Tutor<span className="text-red-500">*</span></label>
					<select id="preferred" {...register('preferred')}>
						<option value="">None</option>
						{tutors?.map(t => {
							const name = t.firstName + ' ' + t.lastName
							return <option key={name} value={t._id.toString()}>{name}</option>
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
