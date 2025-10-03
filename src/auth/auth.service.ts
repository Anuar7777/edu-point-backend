import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { verify } from 'argon2'
import { Response } from 'express'
import { MailService } from 'src/mail/mail.service'
import { UserService } from 'src/user/user.service'
import { JwtPayload } from 'types'
import { AuthDto, RegisterDto } from './dto/auth.dto'
import { UserTokenDto } from './dto/user-token.dto'

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN: number = 7
	REFRESH_TOKEN_NAME: string = 'refreshToken'

	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private mailService: MailService,
	) {}

	async register(dto: RegisterDto) {
		const oldUser = await this.userService.getByEmail(dto.email)

		if (oldUser) {
			if (oldUser.isVerified) {
				throw new BadRequestException('User already exists')
			} else {
				await this.sendVerificationCode(oldUser)
				return {
					message: 'Verification code resent. Please verify your email.',
				}
			}
		}

		const user = await this.userService.create(dto)
		await this.sendVerificationCode(user)

		return { message: 'Account created. Please verify your email.' }
	}

	async verify(email: string, code: string) {
		const verificationCodeWithUser = await this.userService.getVerificationCode(
			email,
			code,
		)

		if (
			!verificationCodeWithUser ||
			verificationCodeWithUser.isUsed ||
			new Date() > verificationCodeWithUser.expiresAt
		) {
			throw new BadRequestException('Invalid code or expired')
		}

		await this.userService.markUserVerified(verificationCodeWithUser.userId)
		await this.userService.markCodeUsed(verificationCodeWithUser.codeId)

		const userDto = new UserTokenDto(verificationCodeWithUser.user)

		const tokens = this.issueTokens(userDto)

		return {
			user: userDto,
			...tokens,
		}
	}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)
		const userDto = new UserTokenDto(user)

		const tokens = this.issueTokens(userDto)

		return {
			user: userDto,
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

		const userDto = new UserTokenDto(userEntity)

		const tokens = this.issueTokens(userDto)

		return {
			user: userDto,
			...tokens,
		}
	}

	private issueTokens(user: UserTokenDto) {
		const data = { id: user.id, role: user.role, email: user.email }

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

		if (!user.isVerified) {
			throw new ForbiddenException('User is not verified')
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

	private async sendVerificationCode(user: User) {
		const code = Math.floor(100000 + Math.random() * 900000).toString()
		await this.userService.saveVerificationCode(user.userId, code)
		await this.mailService.sendVerification(user.email, code)
	}
}
