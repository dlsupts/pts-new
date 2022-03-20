import { FC } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import LoadingSpinner from './loading-spinner'


const AdminLayout: FC = ({ children }) => {
	const router = useRouter()
	const time = (new Date).getTime()
	const { status, data } = useSession({
		required: true,
		onUnauthenticated: () => {
			// stays on the page for at least 500ms to make transitions smooth
			setTimeout(() => router.replace('/?error=You are not logged in.'), time + 500 - (new Date).getTime())
		}
	})

	if (status == 'loading') {
		return <LoadingSpinner className="absolute h-screen w-screen top-0 left-0 bg-white" />
	} else if (data.user.type != 'ADMIN') {
		router.replace('/?error=You are unauthorized.')
	}

	return (
		<div className="container mx-auto pt-12 px-6 md:px-8 lg:px-10 pb-16">
			{children}
		</div>
	)
}

export default AdminLayout
