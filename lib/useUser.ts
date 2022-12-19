import useSWRImmutable from 'swr/immutable'
import app from './axios-config'
import { IUser } from '../models/user'

const fetcher = (url: string) => app.get<IUser>(url).then(res => res.data)

export default function useUser() {
	const { data, error, mutate, isLoading } = useSWRImmutable('/api/me', fetcher)
	return {
		user: data,
		isLoading,
		isError: !!error,
		mutate,
	}
}
