import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import * as basicAuth from 'express-basic-auth'
import { AppModule } from './app.module'

const logger = new Logger('Bootstrap')

async function bootstrap() {
	try {
		const app = await NestFactory.create(AppModule)

		const configService = app.get(ConfigService)

		app.setGlobalPrefix('api')
		app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
		app.use(cookieParser())

		app.use(
			['/api/docs', '/api/docs-json'],
			basicAuth({
				challenge: true,
				users: {
					admin: 'smartbala2025',
				},
			}),
		)

		const swaggerConfig = new DocumentBuilder()
			.setTitle('EduPoint API')
			.setDescription('API documentation for EduPoint')
			.setVersion('1.0')
			.addBearerAuth()
			.build()

		const document = SwaggerModule.createDocument(app, swaggerConfig)
		SwaggerModule.setup('api/docs', app, document)

		await app.listen(configService.get('PORT', 5000))
	} catch (error) {
		logger.error('Error when starting the server: ', error)
		process.exit(1)
	}
}

void bootstrap()
