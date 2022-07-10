import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document'
import { resetServerContext } from 'react-beautiful-dnd'

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
		const initialProps = await Document.getInitialProps(ctx)
		resetServerContext()
		return initialProps
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
