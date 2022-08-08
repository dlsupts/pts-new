/* This example requires Tailwind CSS v2.0+ */
import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Disclosure, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import cn from 'classnames'
import { useSession, signIn, signOut } from 'next-auth/react'
import { matchPath } from '../lib/utils'

interface NavItemProp {
	text: string
	path: string
	isHome?: boolean
}

interface MobNavItemProp extends NavItemProp {
	onClick: () => void
}

const navItems: NavItemProp[] = [
	{ path: '/', text: 'Home', isHome: true },
	{ path: '/about', text: 'About' },
	{ path: '/request', text: 'Request' },
	{ path: '/apply', text: 'Apply' },
]

const MobNavItem: FC<MobNavItemProp> = ({ text, path, isHome, onClick }) => {
	const { pathname } = useRouter()
	const isMatch = matchPath(pathname, path, isHome)

	const className = cn({
		'border-blue-500 text-gray-900 bg-blue-50 text-blue-600': isMatch,
		'border-transparent text-gray-500 hover:text-gray-900': !isMatch,
	}, 'border-l-4 block px-3 py-2 text-base font-medium cursor-pointer')

	return (
		<Link href={path}>
			<a className={className} aria-current={pathname == path ? 'page' : undefined} onClick={onClick}>{text}</a>
		</Link>
	)
}

const NavItem: FC<NavItemProp> = ({ text, path, isHome }) => {
	const { pathname } = useRouter()
	const isMatch = matchPath(pathname, path, isHome)

	const className = cn({
		'border-blue-500 text-gray-900 ': isMatch,
		'border-transparent text-gray-500 hover:text-gray-900': !isMatch,
	}, 'h-full border-b-2 inline-flex justify-center items-center cursor-pointer')

	return (
		<Link href={path} passHref>
			<a className={className}>
				<p className="px-3 py-2 font-medium" aria-current={path == pathname ? 'page' : undefined}>{text}</p>
			</a>
		</Link>
	)
}

const Header: FC = () => {
	const { data: session } = useSession()

	function handleAuthClick() {
		if (session) {
			signOut({ callbackUrl: '/' })
		} else {
			signIn('google', { callbackUrl: '/me' })
		}
	}

	return (
		<header className="h-16 border-b border-gray-200 relative z-50">
			<Disclosure as="nav" className="bg-white h-full">
				{({ open, close }) => (
					<>
						<div className="container mx-auto px-2 sm:px-6 lg:px-8 h-full">
							<div className="relative flex items-center justify-between h-full">
								<div className="absolute inset-y-0 left-0 flex items-center md:hidden">
									<Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
										<span className="sr-only">Open main menu</span>
										{open ? <XIcon className="block h-6 w-6" aria-hidden="true" /> : <MenuIcon className="block h-6 w-6" aria-hidden="true" />}
									</Disclosure.Button>
								</div>
								<div className="flex-1 flex items-center h-full justify-center md:items-stretch md:justify-start">
									<Link href="/" passHref>
										<div className="flex-shrink-0 flex items-center cursor-pointer mr-6">
											<Image className="block w-auto" src="/header-logo.png" alt="PTS Logo" width={96} height={50} />
										</div>
									</Link>
									<div className="hidden md:block md:ml-6">
										<div className="flex space-x-4 items-center h-full">
											{navItems.map(nav => <NavItem key={nav.text} text={nav.text} path={nav.path} isHome={nav.isHome} />)}
											{session && <NavItem text={'My Profile'} path={'/me'} />}
										</div>
									</div>
								</div>
								<div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
									<button type="button" className="blue btn font-medium px-4 py-2 rounded-md" onClick={handleAuthClick}>{session ? 'Logout' : 'Tutor Login'}</button>
								</div>
							</div>
						</div>

						<Transition
							enter="transition duration-100 ease-out"
							enterFrom="transform scale-95 opacity-0"
							enterTo="transform scale-100 opacity-100"
							leave="transition duration-75 ease-out"
							leaveFrom="transform scale-100 opacity-100"
							leaveTo="transform scale-95 opacity-0"
						>

							<Disclosure.Panel className="md:hidden relative bg-white">
								<div className="px-2 pt-2 pb-3 space-y-1">
									{navItems.map(nav => <MobNavItem key={nav.text} text={nav.text} path={nav.path} isHome={nav.isHome} onClick={close} />)}
									{session && <MobNavItem text={'My Profile'} path={'/me'} onClick={close} />}
								</div>
							</Disclosure.Panel>
						</Transition>
					</>
				)}
			</Disclosure>
		</header>
	)
}

export default Header
