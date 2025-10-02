import { Controller } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('user/profile')
export class UserController {
	constructor(private readonly userService: UserService) {}

	// @HttpCode(200)
	// @Auth()
	// @Get()
	// async profile(@CurrentUser('id') id: string) {
	// 	return this.userService.getProfile(id)
	// }

	// @UsePipes(new ValidationPipe())
	// @HttpCode(200)
	// @Auth()
	// @Put()
	// async updateProfile(@CurrentUser('id') id: string, @Body() dto: userDto) {
	// 	return this.userService.update(id, dto)
	// }
}
