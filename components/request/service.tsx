import { Dispatch, FC, SetStateAction, useState } from 'react'
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
import { formatToISODate } from '@lib/utils'
import Link from 'next/link'

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
	}),
	earliestDate: yup.date().transform((curr, orig) => orig == '' ? undefined : curr).when('duration', {
		is: 'One Session',
		then: schema => schema
			.required('This field is required.')
			.typeError('This field is required.')
			.min(new Date(Date.now() + 86_400_000).toLocaleDateString('ph'), 'Please give us at least one day to look for a tutor')
	}),
	latestDate: yup.date().transform((curr, orig) => orig == '' ? undefined : curr).when('duration', {
		is: 'One Session',
		then: schema => schema
			.required('This field is required.')
			.typeError('This field is required.')
	}).when('earliestDate',
		(earliestDate, schema) => earliestDate ? schema.min(earliestDate, 'Date must be on or after the earliest date') : schema,
	),
	policy: yup.boolean().required().oneOf([true], 'This field is required.')
}).required()

type ServiceFormData = Omit<yup.InferType<typeof serviceSchema>, 'earliestDate' | 'latestDate'> & {
	earliestDate: Date | string
	latestDate: Date | string
}

const Service: FC<ServiceProps> = ({ subjects, services, setStep }) => {
	const { request, setRequest, selectedSubjects, setSelectedSubjects, tutee, setTutee } = useStore()
	const { register, handleSubmit, watch, formState: { errors } } = useForm<ServiceFormData>({
		resolver: yupResolver(serviceSchema),
		defaultValues: {
			...request,
			earliestDate: formatToISODate(request.earliestDate),
			latestDate: formatToISODate(request.latestDate)
		}
	})
	const { tutors, isLoading } = useAvailableTutors()
	const [isOpen, setIsOpen] = useState(false)	// for add subject modal
	const duration = watch('duration') as keyof typeof tutorialTypes
	const tutorialType = watch('tutorialType')
	const earliestDate = watch('earliestDate')
	const tomorrow = new Date(Date.now() + 86_400_000)

	const onSubmit = (values: ServiceFormData) => {
		setRequest({
			duration: values.duration as typeof duration,
			tutorialType: values.tutorialType,
			preferred: values.preferred ?? '',
			earliestDate: values.earliestDate as Date,
			latestDate: values.latestDate as Date,
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
				close={() => setIsOpen(false)}
				options={subjects}
				selected={selectedSubjects}
				setSelected={setSelectedSubjects}
			/>
			<form className="grid grid-cols-2 gap-4 mt-8" onSubmit={handleSubmit(onSubmit)}>
				<div className="col-span-full bg-red-100 px-4 py-3 border-red-300 border-2 rounded-md text-sm">
					<p className="underline font-bold text-base mb-2">Academic Honesty Policies</p>
					<ol className="list-decimal [&>*]:ml-8 space-y-2 mb-4">
						<li>A tutee should not ask their tutor for help with graded assessments</li>
						<li> A tutee should not ask for any assistance in accomplishing machine projects </li>
						<li>
							A tutor may point their tutees to helpful resources, such as books or online references while observing intellectual property policies
						</li>
					</ol>
					<p className="italic mb-4">
						You may proceed to our <Link href="/policies" className="text-blue-700 hover:underline">Academic Honesty Policies</Link> for
						more details on the above-mentioned restrictions.
					</p>
					<label htmlFor="policy" className="select-none space-x-2 flex items-center">
						<input type="checkbox" id="policy" {...register('policy')} />
						<span>
							I have read and agreed to the Academic Honesty Policies set forth by the DLSU Peer Tutors Society.
						</span>
						<p className="form-err-msg text-sm">{errors.policy?.message}</p>
					</label>
				</div>
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
						<label htmlFor="friends" className="required">Friends</label>
						<input type="text" {...register('friends')} id="friends" placeholder="Ex. John Velasco, Carla Reyes, etc." defaultValue={tutee.friends?.join(', ')} />
						<p className="form-err-msg text-sm">{errors.friends?.message}</p>
					</div>
				}
				{duration == 'One Session' &&
					<>
						<div>
							<label htmlFor="earliest" className="required">Earliest Date</label>
							<input type="date" {...register('earliestDate')}
								id="earliest"
								min={formatToISODate(tomorrow)}
							/>
							<p className="form-err-msg text-sm">{errors.earliestDate?.message}</p>
						</div>
						<div>
							<label htmlFor="latest" className="required">Latest Date</label>
							<input type="date" {...register('latestDate')}
								id="latest" disabled={!earliestDate}
								min={earliestDate?.toString()}
							/>
							<p className="form-err-msg text-sm">{errors.latestDate?.message}</p>
						</div>
					</>
				}
				<div className="col-span-full mt-8 flex justify-between items-center">
					<div>
						<label className="text-lg font-bold required">Subject List</label>
						<p className="text-gray-500 text-sm">Add subjects that you need help with</p>
					</div>
					<button type="button" title="Add subject" className="btn gray px-3 py-2 rounded-full" onClick={() => setIsOpen(true)}>
						<i className="fa-solid fa-plus fa-lg text-white"></i>
					</button>
				</div>
				<SubjectList className="col-span-full" subjects={selectedSubjects} setSubjects={setSelectedSubjects} />
				<div className="col-span-full flex justify-end">
					<input className="btn blue rounded-md px-4 py-2" type="submit" value="Next" disabled={!selectedSubjects.length} />
				</div>
			</form>
		</>
	)
}

export default Service
