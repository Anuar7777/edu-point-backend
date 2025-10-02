// import { Injectable } from '@nestjs/common'
// import nodemailer from 'nodemailer'

// @Injectable()
// export class MailService {
// 	private transporter = nodemailer.createTransport({
// 		service: 'gmail',
// 		auth: {
// 			user: process.env.MAIL_USER,
// 			pass: process.env.MAIL_PASS,
// 		},
// 	})

// 	async sendVerificationCode(email: string, code: string) {
// 		await this.transporter.sendMail({
// 			from: `"MyApp" <${process.env.MAIL_USER}>`,
// 			to: email,
// 			subject: 'Verify your email',
// 			text: `Your verification code: ${code}`,
// 		})
// 	}
// }
