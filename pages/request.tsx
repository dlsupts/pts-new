import { GetStaticProps, NextPage } from 'next'
import { useState } from 'react'
import Service from '../components/request/service'
import dbConnect from '../lib/db'
import FAQ, { IFAQ } from '../models/faq'
import Library from '../models/library'
import cn from 'classnames'

interface RequestProps {
	faqs: IFAQ[]
	types: string[]
	services: string[]
	subjects: string[]
}

const steps = ['Tutorial Service', 'Personal Info', 'Schedule']

const RequestPage: NextPage<RequestProps> = ({ faqs, types, services, subjects }) => {
	const [help, setHelp] = useState(faqs[0].answer)
	const [step, setStep] = useState(1)

	// when a step is active
	if (step) {
		let comp: JSX.Element

		switch (step) {
			case 1:
				comp = <Service types={types} services={services} subjects={subjects} />
				break
			default:
				comp = <div>No match</div>
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
			<div className="grid place-items-center lg:grid-cols-2 mx-auto h-full container min-h-[10rem] container">

				<div className="flex flex-col items-center pb-10 lg:pb-0 lg:pr-8">
					<div className="mb-6">
						<i className="fa-solid fa-book fa-4x"></i>
					</div>
					<p className="font-bold text-2xl text-center">Tutor Request</p>
					<p className="text-gray-500 text-center mb-8 max-w-prose">Fastest and easiest access to academic assistance is within your reach.</p>
					<button className="btn blue rounded-md px-4 py-2 font-medium" onClick={() => setStep(1)}>Request Now</button>
				</div>
				<div>
					<div className="grid place-items-center mb-20 lg:mb-auto pt-10 w-full lg:pt-0 lg:pl-8 border-gray-300 lg:border-l lg:border-t-0 border-t">
						<div className="mb-6">
							<i className="fa-solid fa-circle-question fa-4x"></i>
						</div>
						<p className="font-bold text-2xl text-center mb-2">Frequently Asked Questions</p>
						<select onChange={e => setHelp(e.target.value)}
							className="w-full max-w-prose border px-3 py-1.5 bg-clip-padding rounded transition ease-in-out cursor-pointer text-sm sm:text-base">
							{faqs.map(f => <option key={f._id.toString()} value={f.answer} className="py-2">{f.question}</option>)}
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
	const faq = await FAQ.findOne({ type: 'Tutor Request' }, '-_id faqs').lean().exec()
	const types = await Library.findById('Tutorial Types', '-_id content').lean().exec()
	const services = await Library.findById('Tutoring Services', '-_id content').lean().exec()
	const subjects = await Library.findById('Subjects', '-_id content').lean().exec()

	return {
		props: {
			faqs: faq?.faqs?.map(f => ({ ...f, _id: f._id.toString() })),
			types: types?.content,
			services: services?.content?.filter(c => c !== 'None'),
			subjects: subjects?.content
		},
		revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATION_INTERVAL)
	}
}

export default RequestPage
