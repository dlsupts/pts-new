import useSWR from 'swr'
import app from './axios-config'
import { IUser } from '../models/user'

const fetcher = (url: string) => app.get<IUser>(url)

export default function useUser() {
	const { data, error, mutate } = useSWR('/api/me', fetcher)
	return {
		user: data?.data,
		isLoading: !data && !error,
		isError: !!error,
		mutate,
	}
}
