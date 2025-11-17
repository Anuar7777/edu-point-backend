import { Controller, Get, HttpCode } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { AchievementService } from './achievement.service'

@ApiTags('Achievements')
@ApiBearerAuth()
@Auth()
@Controller('achievement')
export class AchievementController {
	constructor(private readonly achievementService: AchievementService) {}

	@HttpCode(200)
	@Get('all')
	@ApiOperation({ summary: 'Get all available achievements' })
	@ApiResponse({
		status: 200,
		description: 'List of all achievements returned successfully',
	})
	async getAll() {
		return this.achievementService.getAll()
	}

	@HttpCode(200)
	@Get('me')
	@ApiOperation({ summary: 'Get achievements of the current user' })
	@ApiResponse({
		status: 200,
		description: 'List of user achievements returned successfully',
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized - JWT token missing or invalid',
	})
	async getMyAchievements(@CurrentUser('id') userId: string) {
		return this.achievementService.getUserAchievements(userId)
	}
}
