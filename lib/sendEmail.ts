import nodemailer from 'nodemailer'
import { Options } from 'nodemailer/lib/mailer'
import { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import wrapInLayout from '../components/mail/layout'
import logger from './logger'

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
		pass: process.env.MAIL_PASS,
	},
	tls: {
		rejectUnauthorized: false
	}
})

/**
 * Utility function for sending emails, but only logs a message when not in production
 * @param to - email receipient or a Mail.Options object
 * @param subject - email subject line
 * @param template - the component to statically render in the email
 * @returns a promise to the result of the email sending
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function sendEmail(to: string | Options, subject: string, template: ReactElement) {
	if (process.env.NODE_ENV !== 'production') {
		return await logger.info(`Email with subject: ${subject} was sent to ${to}`)
	}
	
	if (typeof to == 'string') {
		return await transporter.sendMail({
			from: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
			to,
			subject,
			html: wrapInLayout(renderToStaticMarkup(template))
		})
	}

	return await transporter.sendMail({
		from: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
		subject,
		html: wrapInLayout(renderToStaticMarkup(template)),
		...to
	})
}
