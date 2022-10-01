import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.min.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'
import { Session } from 'next-auth'

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
		</SessionProvider>
	)
}

export default MyApp
