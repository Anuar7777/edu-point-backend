import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

const logger = new Logger('Bootstrap')

async function bootstrap() {
	try {
		const app = await NestFactory.create(AppModule)

		const configService = app.get(ConfigService)

		app.setGlobalPrefix('api')
		app.use(cookieParser())

		await app.listen(configService.get('PORT', 5000))
	} catch (error) {
		logger.error('Error when starting the server: ', error)
		process.exit(1)
	}
}

void bootstrap()
