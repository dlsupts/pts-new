import { useState } from 'react'

type FAQProps = {
	faqs: string[][]
	children: React.ReactNode
}

export function FAQs({ faqs, children }: FAQProps) {
	const [idx, setIdx] = useState(0)

	return (
		<>
			<select onChange={e => setIdx(Number(e.target.value))}
				className="w-full max-w-prose border px-3 py-1.5 bg-clip-padding rounded transition ease-in-out cursor-pointer text-sm sm:text-base">
				{children}
			</select>
			<p className="max-w-prose mt-6 font-black text-center min-h-[120px] lg:min-h-[70px]">{faqs[idx][1]}</p>
		</>
	)
}
