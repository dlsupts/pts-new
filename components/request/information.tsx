import { Dispatch, FC, MouseEventHandler, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import useStore, { RequestStore } from '@stores/request-store'
import { tuteeInfoSchema } from '@models/tutee'
import { yupResolver } from '@hookform/resolvers/yup'
import shallow from 'zustand/shallow'

type InformationProps = {
	colleges: string[]
	degreePrograms: string[]
	setStep: Dispatch<SetStateAction<number>>
	campuses: string[]
}

const storeSelector = (state: RequestStore) => [state.tutee, state.setTutee] as const

const Information: FC<InformationProps> = ({ colleges, degreePrograms, campuses, setStep }) => {
	const [tutee, setTutee] = useStore(storeSelector, shallow)
	type Tutee = Omit<typeof tutee, '_id'>
	const { register, handleSubmit, formState: { errors }, watch } = useForm<Tutee>({
		resolver: yupResolver(tuteeInfoSchema),
		defaultValues: tutee
	})

	const college: string = watch('college')

	const onPrevious: MouseEventHandler<HTMLButtonElement> = e => {
		e.preventDefault()
		setStep(x => --x)
	}

	const onSubmit = (values: Tutee) => {
		setTutee(values)
		setStep(x => ++x) // move to next page
	}

	return (
		<>
			<form className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label htmlFor="campus" className="required">Campus</label>
					<select {...register('campus')} id="campus">
						{campuses.map(c => <option key={c} value={c}>{c}</option>)}
					</select>
					<p className="form-err-msg text-sm">{errors.campus?.message}</p>
				</div>
				<div>
					<label htmlFor="college" className="required">College</label>
					<select {...register('college')} id="college">
						{colleges.map(c => <option key={c} value={c}>{c}</option>)}
					</select>
					<p className="form-err-msg text-sm">{errors.college?.message}</p>
				</div>
				<div>
					<label htmlFor="course" className="required">Degree Program</label>
					{college === 'CCS' ?
						<select {...register('course')} id="course">
							{degreePrograms.map(c => <option key={c} value={c}>{c}</option>)}
						</select>
						:
						<input type="text" {...register('course')} id="course" />
					}
					<p className="form-err-msg text-sm">{errors.course?.message}</p>
				</div>
				<div>
					<label htmlFor="id-number" className="required">ID Number</label>
					<input type="number" {...register('idNumber')} id="id-number" min={1} />
					<p className="form-err-msg text-sm">{errors.idNumber?.message}</p>
				</div>
				<div>
					<label htmlFor="first-name" className="required">First Name</label>
					<input type="text" {...register('firstName')} id="first-name" />
					<p className="form-err-msg text-sm">{errors.firstName?.message}</p>
				</div>
				<div>
					<label htmlFor="last-name" className="required">Last Name</label>
					<input type="text" {...register('lastName')} id="last-name" />
					<p className="form-err-msg text-sm">{errors.lastName?.message}</p>
				</div>
				<div>
					<label htmlFor="email" className="required">DLSU Email</label>
					<input type="email" {...register('email')} id="email" />
					<p className="form-err-msg text-sm">{errors.email?.message}</p>
				</div>
				<div>
					<label htmlFor="contact" className="required">Contact Number</label>
					<input type="tel" {...register('contact')} id="contact" />
					<p className="form-err-msg text-sm">{errors.contact?.message}</p>
				</div>
				<div>
					<label htmlFor="url" className="required">Facebook Profile URL</label>
					<input type="url" {...register('url')} id="url" placeholder="https://facebook.com/pts.dlsu" />
					<p className="form-err-msg text-sm">{errors.url?.message}</p>
				</div>
				<div className="col-span-full flex justify-end mt-4">
					<button type="button" className="btn white rounded-md py-2 px-4 mr-2" onClick={onPrevious}>Previous</button>
					<input type="submit" value="Next" className="btn blue rounded-md py-2 px-4" />
				</div>
			</form>
		</>
	)
}

export default Information
