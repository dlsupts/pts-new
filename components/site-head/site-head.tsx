import Head from 'next/head'

type SiteHeadProps = {
	title: string
	description: string
	url: string
}

export function SiteHead({ title, description, url }: SiteHeadProps) {
	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="og:title" content={title} />
			<meta name="og:description" content={description} />
			<meta name="og:url" content={url} />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
		</Head>
	)
}
