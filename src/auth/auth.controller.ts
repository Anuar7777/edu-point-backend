import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { AuthDto, RegisterDto, VerifyCodeDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
		const { refreshToken, ...response } = await this.authService.login(dto)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(@Body() dto: RegisterDto) {
		return await this.authService.register(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('verify')
	async verifyCode(
		@Body() dto: VerifyCodeDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { refreshToken, ...response } = await this.authService.verify(
			dto.email,
			dto.code,
		)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@HttpCode(200)
	@Post('refresh')
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
	async logout(@Res({ passthrough: true }) res: Response) {
		return this.authService.removeRefreshTokenFromResponse(res)
	}
}
