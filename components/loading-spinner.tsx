import classNames from 'classnames'
import { FC, HTMLAttributes } from 'react'

const LoadingSpinner: FC<HTMLAttributes<HTMLDivElement>> = ({ className }) => {
	const cn = classNames("flex justify-center items-center", className)

	return (
		<div className={cn}>
			<div className="spinner-border animate-spin inline-block w-20 h-20 border-8 rounded-full text-blue-700" role="status">
				<span className="visually-hidden">Loading...</span>
			</div>
		</div>
	)
}

export default LoadingSpinner
