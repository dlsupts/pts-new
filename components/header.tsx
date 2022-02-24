/* This example requires Tailwind CSS v2.0+ */
import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import cn from 'classnames'

type NavItemProp = {
	text: string
	path: string
}

const navItems: NavItemProp[] = [ 
	{ path: '/', text: 'Home' },
	{ path: '/about', text: 'About' },
	{ path: '/request', text: 'Request' },
	{ path: '/apply', text: 'Apply' },
]

const MobNavItem: FC<NavItemProp> = ({ text, path }) => {
	const { pathname } = useRouter()

	const className = cn({
		'text-gray-900': pathname == path,
		'text-gray-500 hover:text-gray-900': pathname != path
	}, 'block px-3 py-2 rounded-md text-base font-medium cursor-pointer')

	return (
		<a className={className} aria-current={pathname == path ? 'page' : undefined}>{text}</a>
	)
}

const NavItem: FC<NavItemProp> = ({ text, path }) => {
	const { pathname } = useRouter()

	return (
		<Link href={path}>
			{pathname == path ?
				<a className="text-gray-900 px-3 py-2 font-medium" aria-current="page">{text}</a>
				:
				<a className="text-gray-500 hover:text-gray-900 px-3 py-2 font-medium">{text}</a>
			}
		</Link>
	)
}

const Header: FC = () => {
	return (
		<header className="h-20 border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-full flex justify-between">
				<div className="relative flex items-center justify-between h-full">
					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
						<button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
							<span className="sr-only">Open main menu</span>
							{/* {open ? <XIcon className="block h-6 w-6" aria-hidden="true" /> : <MenuIcon className="block h-6 w-6" aria-hidden="true" />} */}
						</button>
					</div>
					<div className="flex-1 flex items-center h-full justify-center sm:items-stretch sm:justify-start">
						<Link href="/" passHref>
							<div className="flex-shrink-0 flex items-center cursor-pointer mr-6">
								<Image className="block w-auto" src="/header-logo.png" alt="PTS Logo" width={96} height={50} />
							</div>
						</Link>
						<div className="hidden sm:block sm:ml-6">
							<div className="flex space-x-4 items-center h-full">
								{navItems.map(nav => <NavItem key={nav.text} text={nav.text} path={nav.path} />)}
							</div>
						</div>
					</div>
				</div>
				<div className="flex items-center">
					<button className="ml-8 whitespace-nowrap px-4 py-2 border border-transparent rounded-md shadow-sm font-medium text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900">Sign In</button>
				</div>
			</div>

			<div className="sm:hidden" id="mobile-menu">
				<div className="px-2 pt-2 pb-3 space-y-1">
					{navItems.map(nav => <MobNavItem key={nav.text} text={nav.text} path={nav.path} />)}
				</div>
			</div>
		</header>
	)
}

export default Header
