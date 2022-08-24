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
					<link rel="icon" href="/favicon.ico" />
					<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
					<meta property="og:image" content="/og-image.jpg" />
					<meta property="og:type" content="website" />
					<meta property="og:image:width" content="3090" />
					<meta property="og:image:height" content="1356" />
					<meta property="og:image:alt" content="The organization's logo in the middle of computer-related and studying-related things drawn in white outline." />
					<meta name="twitter:card" content="summary_large_image" />
					<meta property="twitter:image" content="/og-image.jpg" />
					<meta property="twitter:site" content="@ptsdlsu" />
					<meta property="twitter:creator" content="@ptsdlsu" />
					<meta name="theme-color" content="#0370be" />
					<meta name="keywords" content="dlsu,de la salle university,pts,peer tutor society,ccs,college of computer science,free,peer tutoring,student tutor"/>
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
