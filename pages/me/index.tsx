import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const TutorPage: NextPage = () => {
	const router = useRouter()
	const { status, data } = useSession({ 
		required: true,
		onUnauthenticated: () => {
			router.replace('/')
		}
	})

	if (status == 'loading') {
		return (
			<p>Loading...</p>
		)
	}

	console.log(data)
	return (
		<p>Welcome {data.user?.name}</p>
	)
}

export default TutorPage
