import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import cn from 'classnames'

type LoadingButtonProps = {
	isLoading: boolean
	children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
	function LoadingButton({ className, isLoading, disabled, children, ...props }, ref) {
		return (
			<button className={cn(className, 'relative', { '!text-transparent': isLoading })} disabled={disabled || isLoading} {...props} ref={ref}>
				{isLoading &&
					<span className="absolute h-full w-full left-1/2 top-1/2 grid place-items-center -translate-x-1/2 -translate-y-1/2 loading" />
				}
				{children}
			</button>
		)
	}
)

export default LoadingButton
