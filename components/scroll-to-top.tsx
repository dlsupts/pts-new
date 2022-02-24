import { useEffect, useState } from 'react'
import cn from 'classnames'

export default function ScrollToTop() {

	useEffect(() => {
		window.addEventListener('scroll', toggleVisible)
		return () => window.removeEventListener('scroll', toggleVisible)
	})

	const [visible, setVisible] = useState(false)

	const toggleVisible = () => {
		const scrolled = document.documentElement.scrollTop

		if (scrolled > 100) {
			setVisible(true)
		} else if (scrolled <= 100) {
			setVisible(false)
		}
	}

	const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

	const className = cn({
		'-right-15': !visible,
		'right-10': visible,
	}, "fixed bottom-10 right-10 rounded-full bg-gray-300 hover:bg-gray-400 active:bg-gray-500 p-4 transition-all")


	return (
		<button className={className} onClick={scrollToTop}>
			<div className="w-5 h-5 flex items-center justify-center">
				<i className="fa-solid fa-arrow-up" />
			</div>
		</button>
	)
}