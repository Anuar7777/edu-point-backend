import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { FamilyModule } from 'src/family/family.module'
import { CodeModule } from '../code/code.module'
import { getJwtConfig } from '../config/jwt.config'
import { MailService } from '../mail/mail.service'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'

@Module({
	imports: [
		UserModule,
		ConfigModule,
		CodeModule,
		FamilyModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, MailService, JwtStrategy],
})
export class AuthModule {}
