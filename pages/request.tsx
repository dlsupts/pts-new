import { GetStaticProps, NextPage } from 'next'
import { useState } from 'react'
import Service from '../components/request/service'
import dbConnect from '../lib/db'
import FAQ, { IFAQ } from '../models/faq'
import Library from '../models/library'
import cn from 'classnames'
import Information from '../components/request/information'
import Schedule from '../components/request/schedule'
import useStore from '../stores/request-store'
import app from '../lib/axios-config'
import { toast } from 'react-toastify'
import { toastErrorConfig, toastSuccessConfig } from '../lib/toast-defaults'
import LoadingSpinner from '../components/loading-spinner'

interface RequestProps {
	faqs: IFAQ[]
	services: string[]
	subjects: string[]
	colleges: string[]
	degreePrograms: string[]
	campuses: string[]
}

const steps = ['Tutorial Service', 'Personal Info', 'Schedule (Free Time)']

const RequestPage: NextPage<RequestProps> = ({ faqs, services, subjects, colleges, degreePrograms, campuses }) => {
	const [help, setHelp] = useState(faqs[0].answer)
	const [step, setStep] = useState(0)
	const { tutee, selectedSubjects, request, resetStore } = useStore()

	// when a step is active
	if (step) {
		let comp = <></>

		switch (step) {
			case 1:
				comp = <Service services={services} subjects={subjects} setStep={setStep} />
				break
			case 2:
				comp = <Information colleges={colleges} degreePrograms={degreePrograms} campuses={campuses} setStep={setStep} />
				break
			case 3:
				comp = <Schedule setStep={setStep} />
				break
			case 4:
				comp = <LoadingSpinner />
				
				// when testing this functionality, turn off React's StrictMode. It causes this request to run twice only in development for some reason.
				app.post('/api/tutees', { tutee, request, subjects: selectedSubjects })
					.then(() => {
						toast.success('You request has been sent.', toastSuccessConfig)
						setStep(0)	// NOTE: important that this goes first before resetting store so as not to rerender and send another request
						resetStore()
					})
					.catch(() => {
						toast.error('An error has occured. Please try again.', toastErrorConfig)
						setStep(3)
					})
				break
			default:
				setStep(0)
		}

		return (
			<div className="container mx-auto px-4">
				<h3 className="font-bold text-2xl mt-6">Request Form</h3>
				<div className="grid grid-cols-3 gap-y-4 md:gap-x-8 my-4 md:px-0">
					{steps.map((s, index) => (
						<div key={s} className={cn({ 'border-blue-500': index < step }, 'steps border-l-4 pl-4 py-2 md:pl-0 md:border-l-0 md:pt-4 md:border-t-4 col-span-full md:col-span-1')}>
							<p className={cn({ 'text-blue-500': index < step, 'text-gray-500': index >= step }, 'text-xs font-bold tracking-wide')}>STEP {index + 1}</p>
							<p className="font-semibold text-sm text-gray-900">{s}</p>
						</div>
					))}
				</div>
				{comp}
			</div>
		)
	}

	return (
		<div className="main-height flex flex-col justify-center px-4 mt-6 lg:mt-0">
			<div className="grid place-items-center lg:grid-cols-2 mx-auto container min-h-[20rem] container gap-y-8">
				<div className="flex flex-col items-center py-16">
					<div className="mb-6">
						<i className="fa-solid fa-book fa-4x"></i>
					</div>
					<p className="font-bold text-2xl text-center">Tutor Request</p>
					<p className="text-gray-500 text-center mb-8 max-w-prose">Fastest and easiest access to academic assistance is within your reach.</p>
					<button className="btn blue rounded-md px-4 py-2 font-medium" onClick={() => setStep(1)}>Request Now</button>
				</div>
				<div className="flex flex-col justify-center items-center py-16 w-full lg:pl-8 border-gray-300 lg:border-l lg:border-t-0 border-t lg:h-full">
					<div className="mb-6">
						<i className="fa-solid fa-circle-question fa-4x"></i>
					</div>
					<p className="font-bold text-2xl text-center mb-2">Frequently Asked Questions</p>
					<select onChange={e => setHelp(e.target.value)}
						className="w-full max-w-prose border px-3 py-1.5 bg-clip-padding rounded transition ease-in-out cursor-pointer text-sm sm:text-base">
						{faqs.map(f => <option key={f._id.toString()} value={f.answer} className="py-2">{f.question}</option>)}
					</select>
					<p className="max-w-prose mt-6 font-black italic text-center min-h-[120px] lg:min-h-[70px]">{help}</p>
				</div>
			</div>
		</div>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	await dbConnect()
	const faq = await FAQ.findOne({ type: 'Tutor Request' }, '-_id faqs').lean().exec()
	const services = await Library.findById('Tutoring Services', '-_id').lean().exec()
	const subjects = await Library.findById('Subjects', '-_id').lean().exec()
	const colleges = await Library.findById('Colleges', '-_id').lean().exec()
	const degreePrograms = await Library.getDegreeCodes()
	const campuses = await Library.findById('Campuses', '-_id').lean().exec()

	return {
		props: {
			faqs: faq?.faqs?.map(f => ({ ...f, _id: f._id.toString() })),
			services: services?.content?.filter(c => c !== 'None'),
			subjects: subjects?.content,
			colleges: colleges?.content?.map(c => c.split(':')[0]),
			degreePrograms,
			campuses: campuses?.content,
		},
		revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATION_INTERVAL)
	}
}

export default RequestPage
