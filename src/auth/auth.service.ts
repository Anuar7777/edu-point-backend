import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { Response } from 'express'
import { UserService } from 'src/user/user.service'
import { JwtPayload } from 'types'
import { AuthDto, RegisterDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN: number = 7
	REFRESH_TOKEN_NAME: string = 'refreshToken'

	constructor(
		private jwt: JwtService,
		private userService: UserService,
	) {}

	async register(dto: RegisterDto) {
		const oldUser = await this.userService.getByEmail(dto.email)

		if (oldUser) {
			throw new BadRequestException('User already exists')
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.create(dto)

		const tokens = this.issueTokens(user.userId)

		return {
			user,
			...tokens,
		}
	}

	async login(dto: AuthDto) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validateUser(dto)
		const tokens = this.issueTokens(user.userId)

		return {
			user,
			...tokens,
		}
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync<JwtPayload>(refreshToken)

		if (!result) {
			throw new UnauthorizedException('Invalid refresh token')
		}

		const userEntity = await this.userService.getById(result.id)

		if (!userEntity) {
			throw new NotFoundException('User not found')
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = userEntity

		const tokens = this.issueTokens(user.userId)

		return {
			user,
			...tokens,
		}
	}

	private issueTokens(userId: string) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h',
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d',
		})

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email)

		if (!user) {
			throw new NotFoundException('User not found')
		}

		const isValid = await verify(user.password, dto.password)

		if (!isValid) {
			throw new UnauthorizedException('Password is invalid')
		}

		return user
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			expires: expiresIn,
			secure: true,

			// TODO: for production add domain => my domain and sameSite => lax
			// domain: 'localhost',
			sameSite: 'none',
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.clearCookie(this.REFRESH_TOKEN_NAME, {
			httpOnly: true,
			secure: true,

			// TODO: for production add domain => my domain and sameSite => lax
			// domain: 'localhost',
			sameSite: 'none',
		})
	}
}
