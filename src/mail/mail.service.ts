import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createTransport, type Transporter } from 'nodemailer'

@Injectable()
export class MailService {
	private transporter: Transporter

	constructor(private configService: ConfigService) {
		this.transporter = createTransport({
			service: 'gmail',
			auth: {
				user: this.configService.get<string>('MAIL_USERNAME'),
				pass: this.configService.get<string>('MAIL_PASSWORD'),
			},
		})
	}

	async sendVerification(email: string, code: string) {
		await this.transporter.sendMail({
			from: `EduPoint Tech`,
			to: email,
			subject: 'Verify your email',
			text: `Your verification code: ${code}`,
		})
	}
}
