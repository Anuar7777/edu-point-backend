import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from 'src/user/user.service'
import { JwtPayload } from 'types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		private userService: UserService,
	) {
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

	async validate({ id }: JwtPayload) {
		return this.userService.getById(id)
	}
}
