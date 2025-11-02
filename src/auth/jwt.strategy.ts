import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserTokenDto } from './dto/user-token.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService) {
		const jwtSecret = configService.get<string>('JWT_SECRET')
		if (!jwtSecret) {
			throw Error('JWT_SECRET is not defined in environment variables')
		}

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtSecret,
		})
	}

	async validate(user: UserTokenDto) {
		return user
	}
}
