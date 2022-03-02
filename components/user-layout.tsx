import Link from 'next/link'
import { FC } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const navItems = [
	{ text: 'Personal Information', href: '/me' },
	{ text: 'Tutor Details', href: '/me/details' },
	{ text: 'Tutorial Sessions', href: '/me/sessions' },
]

const UserLayout: FC = ({ children }) => {
	const router = useRouter()
	const { status } = useSession({
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

	return (
		<div className="container mx-auto grid lg:grid-cols-9 xl:grid-cols-7 pt-12 px-6 md:px-8 lg:px-10">
			<div className="lg:col-span-2 xl:col-span-1">
				{navItems.map(item => (
					<Link key={item.href} href={item.href} passHref>
						<div className="block cursor-pointer text-gray-700 hover:text-gray-900 mb-4">
							{item.text}
						</div>
					</Link>
				))}
			</div>
			<div className="lg:col-span-7 xl:col-span-6">
				{children}
			</div>
		</div>
	)
}

export default UserLayout
