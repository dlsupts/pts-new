import useSWR, { KeyedMutator } from 'swr'
import app from './axios-config'

export function useRetriever<T>(key: string, fallback?: undefined, processor?: undefined): {
	data: T | undefined
	isLoading: boolean
	isError: boolean
	mutate: KeyedMutator<T>
}

export function useRetriever<T>(key: string, fallback: T, processor?: undefined): {
	data: T
	isLoading: boolean
	isError: boolean
	mutate: KeyedMutator<T>
}

export function useRetriever<T, V>(key: string, fallback: T, processor: (data: T) => V): {
	data: V
	isLoading: boolean
	isError: boolean
	mutate: KeyedMutator<T>
}

export function useRetriever<T, V = unknown>(key: string, fallback?: T, processor?: (data: T) => V) {
	const { data, error, mutate, isLoading } = useSWR(key, url => app.get<T>(url).then(res => res.data))
	const temp = data === undefined ? fallback : data

	return {
		data: processor ? processor(temp as T) : temp,
		isLoading,
		isError: !!error,
		mutate
	}
}
