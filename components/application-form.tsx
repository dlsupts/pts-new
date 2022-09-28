import { yupResolver } from '@hookform/resolvers/yup'
import { IUserInfo, userInfoSchema } from '@models/user'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import app from '@lib/axios-config'
import { toast } from 'react-toastify'
import { toastSuccessConfig } from '@lib/toast-defaults'
import { toastAxiosError } from '@lib/utils'
import LoadingButton from './loading-button'

export type FormSchema = Omit<IUserInfo, '_id'>

type ApplicationFormProps = {
	courses: string[]
	onSubmit: () => void
}

export default function ApplicationForm({ courses, onSubmit: toDo }: ApplicationFormProps) {
	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = async (values: FormSchema) => {
		setIsLoading(true)
		try {
			await app.post('/api/applications', values)
			toast.success('Application was sent! Please wait for us to contact you.', toastSuccessConfig)
			toDo()
			reset()
		} catch (e) {
			toastAxiosError(e)
		}
		setIsLoading(false)
	}

	const { register, handleSubmit, formState: { errors }, reset } = useForm<FormSchema>({
		resolver: yupResolver(userInfoSchema)
	})

	return (
		<form className="grid grid-cols-4 gap-4 w-full px-10 py-8 my-0 sm:my-8 border shadow-sm rounded-md" onSubmit={handleSubmit(onSubmit)}>
			<h1 className="font-bold text-2xl col-span-full">Application Form</h1>
			<div className="col-span-full sm:col-span-2">
				<label htmlFor="id-number">ID number<span className='text-red-500'>*</span></label>
				<input type="number" {...register('idNumber')} id="id-number" autoComplete="id-number" required />
				<p className="form-err-msg text-sm">{(errors.idNumber?.type === 'typeError' && 'ID number is required.') || errors.idNumber?.message}</p>
			</div>
			<div className="col-span-full sm:col-span-2">
				<label htmlFor="email">DLSU Email<span className='text-red-500'>*</span></label>
				<input type="email" {...register('email')} id="email" autoComplete="email" required />
				<p className="form-err-msg text-sm">{errors.email?.message}</p>
			</div>
			<div className="col-span-full">
				<label htmlFor="first-name">First name<span className='text-red-500'>*</span></label>
				<input type="text" {...register('firstName')} id="first-name" required />
				<p className="form-err-msg text-sm">{errors.firstName?.message}</p>
			</div>
			<div className="col-span-full">
				<label htmlFor="middle-name">Middle name</label>
				<input type="text" {...register('middleName')} id="middle-name" autoComplete="middle-name" />
				<p className="form-err-msg text-sm">{errors.middleName?.message}</p>
			</div>
			<div className="col-span-full">
				<label htmlFor="last-name">Last name<span className='text-red-500'>*</span></label>
				<input type="text" {...register('lastName')} id="last-name" autoComplete="family-name" required />
				<p className="form-err-msg text-sm">{errors.lastName?.message}</p>
			</div>
			<div className="col-span-full sm:col-span-2">
				<label htmlFor="course">Degree Program<span className='text-red-500'>*</span></label>
				<select {...register('course')} id="course" autoComplete="course" required>
					{courses.map(c => <option key={c}>{c}</option>)}
				</select>
				<p className="form-err-msg text-sm">{errors.course?.message}</p>
			</div>
			<div className="col-span-full sm:col-span-2">
				<label htmlFor="terms">Remaining Terms<span className='text-red-500'>*</span></label>
				<input type="number" {...register('terms')} id="terms" min={1} required />
				<p className="form-err-msg text-sm">{(errors.terms?.type === 'typeError' && 'Remaining terms is required.') || errors.terms?.message}</p>
			</div>
			<div className="col-span-full sm:col-span-2">
				<label htmlFor="contact">Contact Number<span className='text-red-500'>*</span></label>
				<input type="tel" {...register('contact')} id="contact" autoComplete="contact-number" required />
				<p className="form-err-msg text-sm">{errors.contact?.message}</p>
			</div>
			<div className="col-span-full sm:col-span-2">
				<label htmlFor="url">Facebook Profile URL<span className='text-red-500'>*</span></label>
				<input type="text" {...register('url')} id="url" placeholder="https://facebook.com/pts.dlsu" required />
				<p className="form-err-msg text-sm">{errors.url?.message}</p>
			</div>

			<div className="col-span-full flex justify-end mt-2 space-x-2">
				<input type="reset" className="btn gray px-4 py-2 font-medium rounded-md" disabled={isLoading} />
				<LoadingButton type="submit" className="btn blue px-4 py-2 font-medium rounded-md" isLoading={isLoading}>
					Submit
				</LoadingButton>
			</div>
		</form>
	)
}