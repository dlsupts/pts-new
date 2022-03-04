import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import LoadingSpinner from '../../components/loading-spinner'

const AdminPage: NextPage = () => {
	const router = useRouter()
	const time = (new Date).getTime() 
	const { data, status } = useSession({
		required: true,
		onUnauthenticated: () => {
			// stays on the page for at least 500ms to make transitions smooth
			setTimeout(() => router.replace('/?error=You are not logged in.'), time + 500 - (new Date).getTime())
		}
	})

	if (status === 'authenticated' && data?.user?.type !== 'ADMIN') {
		router.replace('/?error=Unauthorized user!')
	} else if (status === 'loading') {
		return <LoadingSpinner className="absolute h-screen w-screen top-0 left-0 bg-white" />
	}

	return (
		<p>Admin Page</p>
	)
}

export default AdminPage