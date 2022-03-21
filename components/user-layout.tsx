import Link from 'next/link'
import { FC } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import LoadingSpinner from './loading-spinner'
import cn from 'classnames'

interface NavItemProp {
	text: string
	path: string
}

const navItems: NavItemProp[] = [
	{ text: 'Personal Information', path: '/me' },
	{ text: 'Tutor Details', path: '/me/details' },
	{ text: 'Tutorial Sessions', path: '/me/sessions' },
]

const NavItem: FC<NavItemProp> = ({ text, path }) => {
	const { pathname } = useRouter()
	
	const className = cn({
		'border-blue-500 text-gray-900 bg-blue-50 text-blue-600': pathname == path,
		'border-transparent text-gray-500 hover:text-gray-900': pathname != path
	}, 'block cursor-pointer mb-2 px-2 py-1 border-l-4')

	return (
		<Link key={path} href={path} passHref>
			<div className={className}>
				{text}
			</div>
		</Link>
	)
}

const UserLayout: FC = ({ children }) => {
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
	}

	return (
		<div className="container mx-auto grid lg:grid-cols-9 xl:grid-cols-7 pt-12 px-6 md:px-8 lg:px-10 pb-16">
			<div className="lg:col-span-2 xl:col-span-1 md:mb-6">
				{navItems.map(item => <NavItem key={item.path} text={item.text} path={item.path} />)}
				{data?.user?.type === 'ADMIN' && <NavItem text='Admin Console' path='/admin' />}
			</div>
			<div className="lg:col-span-7 xl:col-span-6">
				{children}
			</div>
		</div>
	)
}

export default UserLayout
