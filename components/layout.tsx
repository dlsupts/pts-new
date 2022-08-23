import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FC } from 'react'
import AdminHeader from './admin-header'
import Header from './header'
import ScrollToTop from './scroll-to-top'

export const siteTitle = 'Peer Tutors Society'
const META_DESCRIPTION = 'A society of volunteer students who are willing to serve as tutors to students who need academic assistance.'

const Layout: FC = ({ children }) => {
	const { data: session } = useSession()
	const { pathname } = useRouter()

	return (
		<>
			<Head>
				<title>{siteTitle}</title>
				<meta name="description" content={META_DESCRIPTION} />
				<meta name="og:title" content={siteTitle} />
				<meta name="og:description" content={META_DESCRIPTION} />
				<meta name="og:url" content={`${process.env.NEXT_PUBLIC_VERCEL_URL}`} />
				<meta name="twitter:title" content={siteTitle} />
				<meta name="twitter:description" content={META_DESCRIPTION} />
			</Head>
			{session?.user.type === 'ADMIN' && pathname.startsWith('/admin') ? <AdminHeader /> : <Header />}
			<main className="main-height">
				{children}
			</main>
			<footer className="text-gray-500 h-20 md:h-30 px-4 md:px-8">
				<div className="flex justify-between items-center min-h-full mx-auto container">
					<p className="md:text-lg text-sm font-medium">
						<i className="fa-regular fa-copyright mr-1"></i>
						Peer Tutors Society {(new Date()).getFullYear()}.&nbsp;
						<br className="md:hidden" />
						All rights reserved.
					</p>
					<div>
						<a className="footer-icon" title="PTS Facebook Page" href="https://www.facebook.com/pts.dlsu/">
							<i className="fa-brands fa-facebook fa-xl"></i>
						</a>
						<a className="footer-icon" title="PTS Twitter Profile" href="https://twitter.com/ptsdlsu">
							<i className="fa-brands fa-twitter fa-xl"></i>
						</a>
						<a className="footer-icon" title="PTS Email Address" href="mailto:pts@dlsu.edu.ph">
							<i className="fa-solid fa-envelope fa-xl"></i>
						</a>
					</div>
				</div>
			</footer>

			<ScrollToTop />
		</>
	)
}

export default Layout
