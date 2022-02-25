import Head from 'next/head'
import { FC } from 'react'
import Header from './header'
import ScrollToTop from './scroll-to-top'

export const siteTitle = 'Peer Tutors Society'

const Layout: FC = ({ children }) => {
	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<title>{siteTitle}</title>
				<meta
					name="description"
					content="A society of volunteer students who are willing to serve as tutors to students who need academic assistance."
				/>
				<meta
					property="og:image"
					content={`https://og-image.vercel.app/${encodeURI(
						siteTitle
					)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
				/>
				<meta name="og:title" content={siteTitle} />
				<meta name="twitter:card" content="summary_large_image" />
			</Head>
			<Header />
			<main className="main-height">
				{children}
			</main>
			<footer className="text-gray-400 h-20 md:h-30 px-8">
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
