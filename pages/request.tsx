import { GetStaticProps } from 'next'
import { FC, useState } from 'react'
import dbConnect from '../lib/db'
import FAQ, { IFAQ } from '../models/faq'

interface RequestProps {
	faqs: IFAQ[]
}

const RequestPage: FC<RequestProps> = ({ faqs }) => {
	const [help, setHelp] = useState(faqs[0].answer)

	return (
		<div className="main-height flex flex-col justify-center px-4 mt-10 md:mt-0">
			<div className="grid place-items-center lg:grid-cols-2 mx-auto h-full container min-h-[10rem] container">
				<div className="flex flex-col items-center pb-10 lg:pb-0 lg:pr-8">
					<div className="mb-6">
						<i className="fa-solid fa-book fa-4x"></i>
					</div>
					<p className="font-bold text-2xl text-center">Tutor Request</p>
					<p className="text-gray-500 text-center mb-8 max-w-prose">Fastest and easiest access to academic assistance is within your reach.</p>
					<button className="btn blue rounded-md px-4 py-2 font-medium">Request Now</button>
				</div>
				<div className="flex flex-col items-center mb-20 lg:mb-auto pt-10 w-full lg:pt-0 lg:pl-8 border-gray-300 lg:border-l lg:border-t-0 border-t">
					<div className="mb-6">
						<i className="fa-solid fa-circle-question fa-4x"></i>
					</div>
					<p className="font-bold text-2xl text-center mb-2">Frequently Asked Questions</p>
					<select onChange={e => setHelp(e.target.value)}
						className="w-full max-w-prose border px-3 py-1.5 bg-clip-padding rounded transition ease-in-out cursor-pointer">
						{faqs.map(f => <option key={f._id as string} value={f.answer} className="py-2">{f.question}</option>)}
					</select>
					<p className="max-w-prose mt-6 font-black italic text-center">{help}</p>
				</div>
			</div>
		</div>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	await dbConnect()
	const faq = await FAQ.findOne({ type: 'Tutor Request' }, '-_id faqs').lean().exec()

	return {
		props: {
			faqs: faq?.faqs?.map(f => ({ ...f, _id: f._id.toString() }))
		},
		revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATION_INTERVAL)
	}
}

export default RequestPage
