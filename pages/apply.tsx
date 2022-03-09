import { GetStaticProps, NextPage } from 'next'
import { useState } from 'react'
import dbConnect from '../lib/db'
import FAQ, { IFAQ } from '../models/faq'
import Library from '../models/library'
import cn from 'classnames'

interface RequestProps {
	faqs: IFAQ[]
	courses: string[]
}

const RequestPage: NextPage<RequestProps> = ({ faqs, courses }) => {
	const [help, setHelp] = useState(faqs[0].answer)
	const [showForm, setShowForm] = useState(false)

	return (
		<div className="main-height flex flex-col justify-center px-4 mt-10 md:mt-0">
			<div className="grid place-items-center lg:grid-cols-2 grid-cols-auto mx-auto h-full container min-h-[10rem] container">
				{showForm ?
					<form className="grid grid-cols-4 gap-4 w-full px-10 py-8 mb-6 sm:mb-0 border shadow-sm rounded-md">
						<h1 className="font-bold text-2xl col-span-full">Application Form</h1>
						<div className="col-span-full sm:col-span-2">
							<label htmlFor="id-number" className="block text-sm font-medium text-gray-700">ID number</label>
							<input type="number" name="idNumber" id="id-number" autoComplete="id-number"
								className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							/>
						</div>
						<div className="col-span-full sm:col-span-2">
							<label htmlFor="email" className="block text-sm font-medium text-gray-700">DLSU Email</label>
							<input type="email" name="email" id="email" autoComplete="email" pattern=".*(@dlsu.edu.ph)$" required
								className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							/>
						</div>
						<div className="col-span-full">
							<label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
							<input type="text" name="firstName" id="first-name"
								className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							/>
						</div>
						<div className="col-span-full">
							<label htmlFor="middle-name" className="block text-sm font-medium text-gray-700">Middle name</label>
							<input type="text" name="middleName" id="middle-name" autoComplete="middle-name"
								className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							/>
						</div>
						<div className="col-span-full">
							<label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
							<input type="text" name="lastName" id="last-name" autoComplete="family-name"
								className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							/>
						</div>
						<div className="col-span-full sm:col-span-2">
							<label htmlFor="course" className="block text-sm font-medium text-gray-700">Degree Program</label>
							<select name="course" id="course" autoComplete="course"
								className="form-select mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
								{courses.map(c => <option key={c}>{c}</option>)}
							</select>
						</div>
						<div className="col-span-full sm:col-span-2">
							<label htmlFor="terms" className="block text-sm font-medium text-gray-700">Remaining Terms</label>
							<input type="number" name="terms" id="terms" min={0}
								className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							/>
						</div>
						<div className="col-span-full sm:col-span-2">
							<label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
							<input type="tel" name="contact" id="contact" autoComplete="contact-number"
								className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							/>
						</div>
						<div className="col-span-full sm:col-span-2">
							<label htmlFor="url" className="block text-sm font-medium text-gray-700">Facebook Profile URL</label>
							<input type="url" name="url" id="url" autoComplete="contact-number"
								className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							/>
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
