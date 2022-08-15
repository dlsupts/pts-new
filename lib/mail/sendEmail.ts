import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
		pass: process.env.MAIL_PASS,
	},
	tls: {
		rejectUnauthorized: false
	}
}).use('compile', hbs({
	viewEngine: {
		extname: '.hbs',
		layoutsDir: 'lib/mail/layouts',
		defaultLayout: 'main',
	},
	viewPath: 'lib/mail',
	extName: '.hbs',
}))

/**
 * Utility function for sending emails
 * @param to - email receipient
 * @param subject - email subject line
 * @param template - filename of the template, must be located in @lib/mail and has an .hbs extension
 * @param context - the object that contains the data to put inside the hbs template
 * @returns a promise to the result of the email sending
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function sendEmail(to: string, subject: string, template: string, context?: Record<string, any>) {
	return await transporter.sendMail({
		from: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
		to,
		subject,
		//@ts-expect-error: Type library faults
		template,
		context,
	})
}
