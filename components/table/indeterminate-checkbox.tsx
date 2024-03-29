import { useRef, useEffect, HTMLProps } from 'react'

export default function IndeterminateCheckbox({
	indeterminate,
	className,
	...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
	const ref = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (typeof indeterminate === 'boolean' && ref.current) {
			ref.current.indeterminate = !rest.checked && indeterminate
		}
	}, [ref, indeterminate, rest.checked])

	return (
		<input
			type="checkbox"
			ref={ref}
			className={className}
			{...rest}
			onClick={(event) => {event.stopPropagation()}}
		/>
	)
}