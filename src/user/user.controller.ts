import { Controller, Get, HttpCode } from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('User')
@ApiBearerAuth()
@Auth()
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@HttpCode(200)
	@Get('profile')
	@ApiOperation({ summary: 'Get current user profile' })
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved user profile',
	})
	@ApiResponse({
		status: 404,
		description: 'User not found',
	})
	async profile(@CurrentUser('id') userId: string) {
		return this.userService.getProfile(userId)
	}

	// @HttpCode(200)
	// @Auth()
	// @Put()
	// async updateProfile(@CurrentUser('id') id: string, @Body() dto: userDto) {
	// 	return this.userService.update(id, dto)
	// }
}
