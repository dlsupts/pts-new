import { GetStaticProps } from 'next'
import { FC } from 'react'
import dbConnect from '../lib/db'
import FAQ, { IFAQ } from '../models/faq'

interface RequestProps {
	faqs: IFAQ[]
}

const RequestPage: FC<RequestProps> = ({ faqs }) => {
	return (
		<div className="grid place-items-center grid-cols-2 mx-auto h-full container">
			<div>
				<p className="font-bold text-2xl">Tutor Request</p>
			</div>
			<div>
				<p className="font-bold text-2xl">Frequently Asked Questions</p>
				<select>
					{faqs.map(f => <option key={f._id as string}>{f.question}</option>)}
				</select>
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
