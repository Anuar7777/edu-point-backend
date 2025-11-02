import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { AuthDto, RegisterDto, VerifyCodeDto } from './dto/auth.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(200)
	@Post('login')
	@ApiOperation({ summary: 'Login with email and password' })
	@ApiResponse({ status: 200, description: 'Successful login' })
	@ApiResponse({ status: 401, description: 'Invalid credentials' })
	@ApiBody({
		type: AuthDto,
		examples: {
			parent: {
				summary: 'Parent credentials',
				value: { email: 'aigul@smartbala.com', password: 'password123' },
			},
			child1: {
				summary: 'Child (Ернар)',
				value: { email: 'ernar@smartbala.com', password: 'password123' },
			},
			child2: {
				summary: 'Child (Дана)',
				value: { email: 'dana@smartbala.com', password: 'password123' },
			},
			child3: {
				summary: 'Child (Арсен)',
				value: { email: 'arsen@smartbala.com', password: 'password123' },
			},
			child4: {
				summary: 'Child (Мадина)',
				value: { email: 'madina@smartbala.com', password: 'password123' },
			},
		},
	})
	async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
		const { refreshToken, ...response } = await this.authService.login(dto)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@HttpCode(200)
	@Post('register')
	@ApiOperation({ summary: 'Register new user' })
	@ApiResponse({
		status: 200,
		description: 'Account created or verification resent',
	})
	@ApiBody({
		type: RegisterDto,
		examples: {
			parent: {
				summary: 'Register parent account',
				value: {
					email: 'aidar@smartbala.com',
					password: 'password123',
					username: 'Aidar',
					role: 'PARENT',
				},
			},
			child: {
				summary: 'Register child account',
				value: {
					email: 'alina@smartbala.com',
					password: 'password123',
					username: 'Alina',
					role: 'CHILD',
				},
			},
		},
	})
	async register(@Body() dto: RegisterDto) {
		return await this.authService.register(dto)
	}

	@HttpCode(200)
	@Post('verify')
	@ApiOperation({ summary: 'Verify email with code' })
	@ApiResponse({ status: 200, description: 'User verified and tokens issued' })
	async verifyCode(
		@Body() dto: VerifyCodeDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { refreshToken, ...response } = await this.authService.verify(
			dto.email,
			dto.code,
			dto.language,
		)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@HttpCode(200)
	@Post('refresh')
	@ApiOperation({ summary: 'Get new tokens using refresh token' })
	@ApiResponse({ status: 200, description: 'New tokens generated' })
	@ApiResponse({ status: 401, description: 'Refresh token missing or invalid' })
	async getNewTokens(
		@Req()
		req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const refreshTokenFromCookies = req.cookies[
			this.authService.REFRESH_TOKEN_NAME
		] as string | undefined

		if (!refreshTokenFromCookies) {
			this.authService.removeRefreshTokenFromResponse(res)
			throw new UnauthorizedException('Refresh token not passed')
		}

		const { refreshToken, ...response } = await this.authService.getNewTokens(
			refreshTokenFromCookies,
		)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@HttpCode(200)
	@Post('logout')
	@ApiOperation({ summary: 'Logout and clear refresh token' })
	async logout(@Res({ passthrough: true }) res: Response) {
		return this.authService.removeRefreshTokenFromResponse(res)
	}
}
