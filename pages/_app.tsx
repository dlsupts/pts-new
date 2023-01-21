import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.min.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'
import { Session } from 'next-auth'
import Script from 'next/script'

function MyApp({
	Component,
	pageProps: { session, ...pageProps }
}: AppProps<{
	session: Session
}>) {
	return (
		<SessionProvider session={session}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
			<ToastContainer />
			<Script async src="https://www.googletagmanager.com/gtag/js?id=G-T918DMRK20" />
			<Script id="google-tag-manager">{`
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments)}
				gtag('js', new Date());
				gtag('config', 'G-T918DMRK20');
			`}</Script>
		</SessionProvider>
	)
}

export default MyApp
