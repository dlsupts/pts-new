import useSWR from 'swr'
import app from './axios-config'

export function useRetrieverWithFallback<T>(key: string, fallback: T) {
	const { data, error, mutate } = useSWR(key, url => app.get<T>(url).then(res => res.data))

	return {
		data: data == undefined ? fallback : data,
		isLoading: !data && !error,
		isError: !!error,
		mutate
	}
}

export default function useRetriever<T>(key: string) {
	const { data, error, mutate } = useSWR(key, url => app.get<T>(url).then(res => res.data))

	return {
		data: data,
		isLoading: !data && !error,
		isError: !!error,
		mutate
	}
}
