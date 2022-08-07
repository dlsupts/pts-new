import { GetStaticProps, NextPage } from 'next'
import { useEffect, useState } from 'react'
import dbConnect from '../lib/db'
import Library from '../models/library'
import cn from 'classnames'
import { IUserInfo, userInfoSchema } from '../models/user'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import app from '../lib/axios-config'
import { toast } from 'react-toastify'
import { toastSuccessConfig, toastErrorConfig } from '../lib/toast-defaults'
import axios from 'axios'
import { parseContent } from '@lib/utils'
import { useRetriever } from '@lib/useRetriever'
import { IDate } from '@models/date'
import Head from 'next/head'
import { siteTitle } from '@components/layout'

interface RequestProps {
	faqs: string[][]
	courses: string[]
}

type FormSchema = Omit<IUserInfo, '_id'>

const RequestPage: NextPage<RequestProps> = ({ faqs, courses }) => {
	const [help, setHelp] = useState(faqs[0][1])
	const [showForm, setShowForm] = useState(false)
	const [applyError, setApplyError] = useState('Checking availability...')
	const { register, handleSubmit, formState: { errors }, reset } = useForm<FormSchema>({
		resolver: yupResolver(userInfoSchema)
	})
	const { data: date } = useRetriever<IDate>('/api/dates/Tutor Recruitment')
	const { data: isMaintenance } = useRetriever<boolean>('/api/maintenance')

	useEffect(() => {
		if (date == undefined || isMaintenance == undefined) return
		if (isMaintenance) return setApplyError('System is in maintenance mode.')

		const today = new Date().getTime()
		if (today < new Date(date.start).getTime()) return setApplyError('Application period has not yet started!')
		if (today > new Date(date.end).getTime()) return setApplyError('Application period has passed!')
		setApplyError('')
	}, [isMaintenance, date])

	const onSubmit = async (values: FormSchema) => {
		try {
			await app.post('/api/applications', values)
			toast.success('Application was sent! Please wait for us to contact you.', toastSuccessConfig)
			setShowForm(false)
			reset()
		} catch (e) {
			if (axios.isAxiosError(e)) {
				toast.error(e?.response?.data, toastErrorConfig)
			}
		}
	}

	return (
		<div className="main-height flex flex-col justify-center px-4 mt-10 md:mt-0">
			<Head>
				<title>{siteTitle} | Apply</title>
			</Head>
			<div className="grid place-items-center lg:grid-cols-2 grid-cols-auto mx-auto min-h-[20rem] container gap-y-8">
				{showForm ?
					<form className="grid grid-cols-4 gap-4 w-full px-10 py-8 my-0 sm:my-8 border shadow-sm rounded-md" onSubmit={handleSubmit(onSubmit)}>
						<h1 className="font-bold text-2xl col-span-full">Application Form</h1>
						<div className="col-span-full sm:col-span-2">
							<label htmlFor="id-number">ID number<span className='text-red-500'>*</span></label>
							<input type="number" {...register('idNumber')} id="id-number" autoComplete="id-number" required />
							<p className="form-err-msg text-sm">{(errors.idNumber?.type === 'typeError' && 'ID number is required.') || errors.idNumber?.message}</p>
						</div>
						<div className="col-span-full sm:col-span-2">
							<label htmlFor="email">DLSU Email<span className='text-red-500'>*</span></label>
							<input type="email" {...register('email')} id="email" autoComplete="email" required pattern='.*(@dlsu.edu.ph)$' />
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
							<input type="number" {...register('terms')} id="terms" min={0} required />
							<p className="form-err-msg text-sm">{(errors.terms?.type === 'typeError' && 'Remaining terms is required.') || errors.terms?.message}</p>
						</div>
						<div className="col-span-full sm:col-span-2">
							<label htmlFor="contact">Contact Number<span className='text-red-500'>*</span></label>
							<input type="tel" {...register('contact')} id="contact" autoComplete="contact-number" required />
							<p className="form-err-msg text-sm">{errors.contact?.message}</p>
						</div>
						<div className="col-span-full sm:col-span-2">
							<label htmlFor="url">Facebook Profile URL<span className='text-red-500'>*</span></label>
							<input type="url" {...register('url')} id="url" autoComplete="contact-number" required />
							<p className="form-err-msg text-sm">{errors.url?.message}</p>
						</div>

						<div className="col-span-full flex justify-end">
							<input type="submit" className="btn blue px-4 py-2 font-medium rounded-md mt-2" />
						</div>
					</form>
					:
					<div className="flex flex-col items-center py-16">
						<div className="mb-6">
							<i className="fa-solid fa-chalkboard-user fa-4x"></i>
						</div>
						<p className="font-bold text-2xl text-center">Tutor Recruitment</p>
						<p className="text-gray-500 text-center mb-8 max-w-prose">Share your knowledge, inspire others, and grow as a peer tutor.</p>
						<button className="btn blue rounded-md px-4 py-2 font-medium" onClick={() => setShowForm(true)}
							disabled={applyError !== ''}>{applyError === '' ? 'Apply Now' : applyError}</button>
					</div>
				}
				<div className={cn({ 'lg:border-l': !showForm }, "flex flex-col justify-center items-center py-16 w-full lg:pl-8 border-gray-300 lg:border-t-0 border-t lg:h-full")}>
					<div className="mb-6">
						<i className="fa-solid fa-circle-question fa-4x"></i>
					</div>
					<p className="font-bold text-2xl text-center mb-2">Frequently Asked Questions</p>
					<select onChange={e => setHelp(e.target.value)}
						className="w-full max-w-prose border px-3 py-1.5 bg-clip-padding rounded transition ease-in-out cursor-pointer text-sm sm:text-base">
						{faqs.map(f => <option key={f[0]} value={f[1]} className="py-2">{f[0]}</option>)}
					</select>
					<p className="max-w-prose mt-6 font-black italic text-center min-h-[120px] lg:min-h-[75px]">{help}</p>
				</div>
			</div>
		</div>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	await dbConnect()
	const courses = await Library.getDegreeCodes()
	const faq = await Library.findById('Tutor Recruitment FAQ', '-_id').lean().exec()

	return {
		props: {
			faqs: faq?.content.map(f => parseContent(f)),
			courses
		},
		revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATION_INTERVAL)
	}
}

export default RequestPage
