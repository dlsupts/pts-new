import { NextPage } from 'next'
import AdminLayout from '../../components/admin-layout'
import useSWR from 'swr'
import app from '../../lib/axios-config'
import { IUser } from '../../models/user'
import Table from '../../components/table/table'
import LoadingSpinner from '../../components/loading-spinner'
import { toast } from 'react-toastify'
import { toastErrorConfig } from '../../lib/toast-defaults'
import { useMemo } from 'react'
import { Column } from 'react-table'

function useTutors() {
	const { data, error } = useSWR('/api/tutors', url => app.get<(IUser & { status?: string })[]>(url))

	return {
		tutors: data?.data,
		isLoading: !data && !error,
		isError: !!error
	}
}

const columns: Column<IUser & { status?: string }>[] = [
	{ Header: 'ID Number', accessor: 'idNumber' },
	{ Header: 'Last Name', accessor: 'lastName' },
	{ Header: 'First Name', accessor: 'firstName' },
	{ Header: 'Email', accessor: 'email' },
	{ Header: 'Status', accessor: 'status' },
]

const AdminPage: NextPage = () => {
	const { tutors, isLoading, isError } = useTutors()
	// pre-process data
	const data = useMemo(() => {
		tutors?.forEach(t => {
			if (t.reset) {
				t.status = 'Pending'
			} else {
				t.status = t.membership ? 'Active' : 'Inactive'
			}
		})
		return tutors || []
	}, [tutors])
	const tableInstance = Table({ columns, data })

	if (isLoading) {
		return <LoadingSpinner />
	} else if (isError || !tutors) {
		toast.error('An error has occured. Please try again.', toastErrorConfig)
	}


	return (
		<AdminLayout>
			{tableInstance}
		</AdminLayout>
	)
}

export default AdminPage