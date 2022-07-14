import nodemailer from 'nodemailer'

/**
 * Utility function for sending emails
 * @param to - email receipient
 * @param subject - email subject line
 * @param html - string in markup syntax to create the email body
 * @returns a promise to the result of the email sending
 */
async function sendEmail(to: string, subject: string, html: string) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.ADMIN_EMAIL,
			pass: process.env.MAIL_PASS,
		},
		tls: {
			rejectUnauthorized: false
		}
	})

	return await transporter.sendMail({ from: process.env.ADMIN_EMAIL, to, subject, html })
}

export async function sendApplicationConfirmation(to: string) {
	return sendEmail(to, '[PTS] Tutor Application', `
		<p>Good day!</p>
		<p>Thank you for applying to become a tutor in PTS!</p>
		<p>Please wait for future emails as we will contact you shortly to schedule an interview.</p>
	`)
}