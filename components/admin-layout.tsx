import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import LoadingSpinner from './loading-spinner'
import Head from 'next/head'


const AdminLayout = ({ children }:{children:React.ReactNode}) => {
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
	} else if (data?.user?.type != 'ADMIN') {
		router.replace('/?error=You are unauthorized.')
	}

	return (
		<div className="container mx-auto pt-4 sm:pt-8 px-6 md:px-8 lg:px-10 pb-16">
			<Head>
				<meta name="robots" content="none" />
			</Head>
			{children}
		</div>
	)
}

export default AdminLayout
