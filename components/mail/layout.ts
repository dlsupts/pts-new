const wrapInLayout = (body: string) => `
<!DOCTYPE html>
<html lang="en">

<head>
	<!--[if !mso]><!-- -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<!--<![endif]-->
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>New Request</title>
</head>

<body>
	<p>Good day!</p>
	${body}
	<p>
		Regards,<br>
		<strong>Peer Tutors Society Web Service</strong>
	</p>
</body>

</html>
`

export default wrapInLayout
