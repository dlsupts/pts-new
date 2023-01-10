import { useRetriever } from '@lib/useRetriever'
import { IDate } from '@models/date'
import { ButtonHTMLAttributes, useEffect, useState } from 'react'

export function RequestButton({ disabled, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
	const [requestError, setRequestError] = useState('Checking availability...')
	const { data: date } = useRetriever<IDate>('/api/dates/Tutor Request')
	const { data: isMaintenance } = useRetriever<boolean>('/api/maintenance')

	useEffect(() => {
		if (date == undefined || isMaintenance == undefined) return
		if (isMaintenance) return setRequestError('System is in maintenance mode.')

		const today = new Date().getTime()
		if (today < new Date(date.start).getTime()) return setRequestError('Request period has not yet started!')
		if (today > new Date(date.end).getTime()) return setRequestError('Request period has passed!')
		setRequestError('')
	}, [isMaintenance, date])

	return (
		<button {...props} disabled={disabled || requestError !== ''}>
			{requestError == '' ? 'Request Now' : requestError}
		</button>
	)
}
