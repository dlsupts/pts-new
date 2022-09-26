import { Dispatch, FC, MouseEventHandler, SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSWRImmutable from 'swr/immutable'
import app from '@lib/axios-config'
import LoadingSpinner from '../loading-spinner'
import SubjectList from '../subject-list/list'
import AddSubjectModal from '../subject-list/modal'
import useStore from '@stores/request-store'
import { IUser } from '@models/user'
import tutorialTypes from '@lib/tutorial-types'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

type ServiceProps = {
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

const serviceSchema = yup.object({
	duration: yup.string().required('Duration is required.'),
	tutorialType: yup.string().required('Type is required.'),
	preferred: yup.string().notRequired(),
	friends: yup.string().when('tutorialType', {
		is: 'Group Study',
		then: schema => schema.required('This field is required.')
	})
}).required()

type ServiceFormData = yup.InferType<typeof serviceSchema>

const Service: FC<ServiceProps> = ({ subjects, services, setStep }) => {
	const { request, setRequest, selectedSubjects, setSelectedSubjects, tutee, setTutee } = useStore()
	const { register, handleSubmit, watch, formState: { errors } } = useForm<ServiceFormData>({
		resolver: yupResolver(serviceSchema),
		defaultValues: request
	})
	const { tutors, isLoading } = useAvailableTutors()
	const [isOpen, setIsOpen] = useState(false)	// for add subject modal
	const duration = watch('duration') as keyof typeof tutorialTypes
	const tutorialType = watch('tutorialType')

	const handleAddClick: MouseEventHandler = e => {
		e.preventDefault()
		setIsOpen(true)
	}

	const onSubmit = (values: ServiceFormData) => {
		setRequest({
			duration: values.duration as typeof duration,
			tutorialType: values.tutorialType,
			preferred: values.preferred ?? ''
		})

		if (values.tutorialType === 'Group Study') {
			setTutee({ friends: values.friends?.split(',').map(f => f.trim()) })
		}

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
					<label htmlFor="duration" className="required">Tutoring Duration</label>
					<select {...register('duration')} id="duration">
						{services.map(s => <option key={s} value={s}>{s}</option>)}
					</select>
				</div>
				<div>
					<label htmlFor="type" className="required">Tutorial Type</label>
					<select id="type" {...register('tutorialType')}>
						{Object.entries(tutorialTypes[duration]).map(t => <option key={t[0]} value={t[0]}>{t[1]}</option>)}
					</select>
				</div>
				<div className="col-span-full">
					<label htmlFor="preferred" className="required">Preferred Tutor</label>
					<select id="preferred" {...register('preferred')}>
						<option value="">None</option>
						{tutors?.map(t => {
							const name = t.firstName + ' ' + t.lastName
							return <option key={name} value={t._id.toString()}>{name}</option>
						})}
					</select>
				</div>
				{tutorialType === 'Group Study' &&
					<div className="col-span-full">
						<label htmlFor="friends">Friends<span className="text-red-500">*</span></label>
						<input type="text" {...register('friends')} id="friends" placeholder="Ex. John Velasco, Carla Reyes, etc." defaultValue={tutee.friends?.join(', ')} />
						<p className="form-err-msg text-sm">{errors.friends?.message}</p>
					</div>
				}
				<div className="col-span-full mt-8 flex justify-between items-center">
					<div>
						<label className="text-lg font-bold required">Subject List</label>
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
