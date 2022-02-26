import type { NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
	return (
		<div className="main-height grid place-items-center py-10 mx-auto px-4 sm:py-12 sm:px-6 md:py-16 lg:py-20 lg:px-8 xl:py-28 bg-blue-700 bg-blend-multiply
			bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url('/home-bg.jpg')` }}>
			<div className="sm:text-center">
				<h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
					<span className="xl:inline text-white">Share. Inspire.</span>{' '}
					<span className="text-blue-100 xl:inline">Grow.</span>
				</h1>
				<p className="mt-3 text-gray-300 sm:mt-5 sm:text-lg max-w-prose sm:mx-auto md:mt-5 md:text-xl">
					Are you in control of your grades, or are your grades controlling you?
					Don&apos;t worry. the <b>Peer Tutor Society</b> is here to help you take back your control over you academics!
				</p>
				<div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
					<div className="rounded-md shadow">
						<a href='#' className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-gray-100 hover:bg-white cursor-pointer md:py-4 md:text-lg md:px-10" >
							Get started
						</a>
					</div>
					<div className="mt-3 sm:mt-0 sm:ml-3">
						<Link href={'/about'}>
							<a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-white bg-opacity-25 hover:bg-opacity-30 md:py-4 md:text-lg md:px-10" >
								About Us
							</a>
						</Link>
					</div>
				</div>
			</div>
			<a href="https://www.pexels.com/@cottonbro" className="text-sm absolute right-2 bottom-2 text-gray-500">Photo by <b>cottonbro</b> from <b>Pexels</b></a>
		</div>
	)
}

export default Home
