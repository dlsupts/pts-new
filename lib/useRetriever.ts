import useSWR from 'swr'
import app from './axios-config'

export default function useRetriever<T>(key: string, fallback?: T) {
	const { data, error, mutate } = useSWR(key, url => app.get<T>(url).then(res => res.data))

	return {
		data: data || fallback,
		isLoading: !data && !error,
		isError: !!error,
		mutate
	}
}
