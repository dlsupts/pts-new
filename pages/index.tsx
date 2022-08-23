import type { NextPage } from 'next'
import Link from 'next/link'
import { requests, applications } from '../posts/home'
import { toast } from 'react-toastify'
import { toastErrorConfig } from '../lib/toast-defaults'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
	const { query } = useRouter()

	useEffect(() => {
		toast.error(query.error, toastErrorConfig)
	}, [query])

	return (
		<>
			<div className="main-height-full grid place-items-center py-10 mx-auto px-4 sm:py-12 sm:px-6 md:py-16 lg:py-20 lg:px-8 xl:py-28 bg-blue-900 bg-blend-multiply
			bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url('/home-bg.jpg')` }}>
				<div className="sm:text-center">
					<h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
						<span className="xl:inline text-white">Share. Inspire.</span>{' '}
						<span className="text-blue-100 xl:inline">Grow.</span>
					</h1>
					<p className="mt-3 text-gray-300 sm:mt-5 sm:text-lg max-w-prose sm:mx-auto md:mt-5 md:text-xl">
						Have a challenging subject or two this term? Don&apos;t worry, {' '}
						<span className="font-bold">Peer Tutors Society</span> is here to help you with your academic needs!
					</p>
					<div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
						<div className="rounded-md shadow">
							<a href='#tutor-requests' className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-gray-100 hover:bg-white cursor-pointer md:py-4 md:text-lg md:px-10" >
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
			</div>

			<div className="py-20 bg-white" id="tutor-requests">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="lg:text-center">
						<h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Tutor Requests</h2>
						<p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
							Need help?
						</p>
						<p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
							Just send us a <Link href={'/request'} passHref><a className="underline text-blue-700 hover:text-blue-800">tutor request</a></Link>
							, and we will match you with an available tutor as soon as we can.
						</p>
					</div>

					<div className="mt-10">
						<dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
							{requests.map((item) => (
								<div key={item.name} className="relative">
									<dt>
										<div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
											<item.icon className="h-6 w-6" aria-hidden="true" />
										</div>
										<p className="ml-16 text-lg leading-6 font-medium text-gray-900">{item.name}</p>
									</dt>
									<dd className="mt-2 ml-16 text-base text-gray-500">{item.description}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</div>

			<div className="py-20 bg-blue-700">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="lg:text-center">
						<h2 className="text-base text-gray-50 font-semibold tracking-wide uppercase">Tutor Application</h2>
						<p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
							Want to join us?
						</p>
						<p className="mt-4 max-w-2xl text-xl text-gray-100 lg:mx-auto">
							Feeling the fire to volunteer and teach?
							Send us <Link href={'/apply'}><a className="underline text-gray-100 hover:text-white">your application</a></Link> now!
						</p>
					</div>

					<div className="mt-10">
						<dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
							{applications.map((item) => (
								<div key={item.name} className="relative">
									<dt>
										<div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-white text-blue-500">
											<item.icon className="h-6 w-6" aria-hidden="true" />
										</div>
										<p className="ml-16 text-lg leading-6 font-medium text-gray-50">{item.name}</p>
									</dt>
									<dd className="mt-2 ml-16 text-base text-gray-100">{item.description}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</div>
		</>
	)
}

export default Home
