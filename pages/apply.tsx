import { GetStaticProps, NextPage } from 'next'
import { useState } from 'react'
import dbConnect from '../lib/db'
import FAQ, { IFAQ } from '../models/faq'
import Library from '../models/library'
import cn from 'classnames'
import { IUserInfo, userInfoSchema } from '../models/user'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import app from '../lib/axios-config'
import { toast } from 'react-toastify'
import { toastSuccessConfig, toastErrorConfig } from '../lib/toast-defaults'

interface RequestProps {
	faqs: IFAQ[]
	courses: string[]
}

const RequestPage: NextPage<RequestProps> = ({ faqs, courses }) => {
	const [help, setHelp] = useState(faqs[0].answer)
	const [showForm, setShowForm] = useState(false)
	const { register, handleSubmit, formState: { errors }, reset } = useForm<IUserInfo>({
		reValidateMode: 'onBlur', 
		resolver: yupResolver(userInfoSchema) 
	})

	const onSubmit = async (values: IUserInfo) => {
		const { status } = await app.post('/api/applications', values)
		if (status === 200) {
			toast.success('Application was sent! Please wait for us to contact you.', toastSuccessConfig)
			setShowForm(false)
			reset()
		} else {
			toast.error('A server-side error has occured. Please try again.', toastErrorConfig)
		}
	}

	return (
		<div className="main-height flex flex-col justify-center px-4 mt-10 md:mt-0">
			<div className="grid place-items-center lg:grid-cols-2 grid-cols-auto mx-auto h-full container min-h-[10rem] container">
				{showForm ?
					<form className="grid grid-cols-4 gap-4 w-full px-10 py-8 my-0 sm:my-8 border shadow-sm rounded-md" onSubmit={handleSubmit(onSubmit)}>
						<h1 className="font-bold text-2xl col-span-full">Application Form</h1>
						<div className="col-span-full sm:col-span-2">
							<label htmlFor="id-number" className="block text-sm font-medium text-gray-700">ID number<span className='text-red-500'>*</span></label>
							<input type="number" {...register('idNumber')} id="id-number" autoComplete="id-number" required
								className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							/>
							<p className="form-err-msg text-sm">{(errors.idNumber?.type === 'typeError' && 'ID number is required.') || errors.idNumber?.message}</p>
						</div>
						<div className="col-span-full sm:col-span-2">
							<label htmlFor="email" className="block text-sm font-medium text-gray-700">DLSU Email<span className='text-red-500'>*</span></label>
							<input type="email" {...register('email')} id="email" autoComplete="email" required pattern='.*(@dlsu.edu.ph)$'
								className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							/>
							<p className="form-err-msg text-sm">{errors.email?.message}</p>
						</div>
						<div className="col-span-full">
							<label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name<span className='text-red-500'>*</span></label>
							<input type="text" {...register('firstName')} id="first-name" required
								className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							/>
							<p className="form-err-msg text-sm">{errors.firstName?.message}</p>
						</div>
						<div className="col-span-full">
							<label htmlFor="middle-name" className="block text-sm font-medium text-gray-700">Middle name</label>
							<input type="text" {...register('middleName')} id="middle-name" autoComplete="middle-name"
								className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							/>
							<p className="form-err-msg text-sm">{errors.middleName?.message}</p>
						</div>
						<div className="col-span-full">
							<label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name<span className='text-red-500'>*</span></label>
							<input type="text" {...register('lastName')} id="last-name" autoComplete="family-name" required
								className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							/>
							<p className="form-err-msg text-sm">{errors.lastName?.message}</p>
						</div>
						<div className="col-span-full sm:col-span-2">
							<label htmlFor="course" className="block text-sm font-medium text-gray-700">Degree Program<span className='text-red-500'>*</span></label>
							<select {...register('course')} id="course" autoComplete="course" required
								className="form-select mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
								{courses.map(c => <option key={c}>{c}</option>)}
							</select>
							<p className="form-err-msg text-sm">{errors.course?.message}</p>
						</div>
						<div className="col-span-full sm:col-span-2">
							<label htmlFor="terms" className="block text-sm font-medium text-gray-700">Remaining Terms<span className='text-red-500'>*</span></label>
							<input type="number" {...register('terms')} id="terms" min={0} required
								className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							/>
							<p className="form-err-msg text-sm">{(errors.terms?.type === 'typeError' && 'Remaining terms is required.') || errors.terms?.message}</p>
						</div>
						<div className="col-span-full sm:col-span-2">
							<label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number<span className='text-red-500'>*</span></label>
							<input type="tel" {...register('contact')}id="contact" autoComplete="contact-number" required
								className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							/>
							<p className="form-err-msg text-sm">{errors.contact?.message}</p>
						</div>
						<div className="col-span-full sm:col-span-2">
							<label htmlFor="url" className="block text-sm font-medium text-gray-700">Facebook Profile URL<span className='text-red-500'>*</span></label>
							<input type="url" {...register('url')} id="url" autoComplete="contact-number" required
								className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							/>
							<p className="form-err-msg text-sm">{errors.url?.message}</p>
						</div>

						<div className="col-span-full flex justify-end">
							<input type="submit" className="btn blue px-4 py-2 font-medium rounded-md mt-2" />
						</div>
					</form>
					:
					<div className="flex flex-col items-center w-full pb-10 lg:pb-0 lg:pr-8">
						<div className="mb-6">
							<i className="fa-solid fa-chalkboard-user fa-4x"></i>
						</div>
						<p className="font-bold text-2xl text-center">Tutor Recruitment</p>
						<p className="text-gray-500 text-center mb-8 max-w-prose">Share your knowledge, inspire others, and grow as a peer tutor.</p>
						<button className="btn blue rounded-md px-4 py-2 font-medium" onClick={() => setShowForm(true)}>Apply Now</button>
					</div>
				}
				<div>
					<div className={cn({ 'lg:border-l': !showForm }, "flex flex-col items-center mb-20 lg:mb-auto pt-10 lg:pt-0 lg:pl-8 w-full border-gray-300 lg:border-t-0 border-t")}>
						<div className="mb-6">
							<i className="fa-solid fa-circle-question fa-4x"></i>
						</div>
						<p className="font-bold text-2xl text-center mb-2">Frequently Asked Questions</p>
						<select onChange={e => setHelp(e.target.value)}
							className="w-full max-w-prose border px-3 py-1.5 bg-clip-padding rounded transition ease-in-out cursor-pointer text-sm sm:text-base">
							{faqs.map(f => <option key={f._id as string} value={f.answer} className="py-2">{f.question}</option>)}
						</select>
						<p className="max-w-prose mt-6 font-black italic text-center">{help}</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	await dbConnect()
	const courses = await Library.getDegreeCodes()
	const faq = await FAQ.findOne({ type: 'Tutor Recruitment' }, '-_id faqs').lean().exec()

	return {
		props: {
			faqs: faq?.faqs?.map(f => ({ ...f, _id: f._id.toString() })),
			courses
		},
		revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATION_INTERVAL)
	}
}

export default RequestPage
