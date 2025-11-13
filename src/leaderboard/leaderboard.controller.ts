import { Controller, Get, Query } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { LeaderboardService } from './leaderboard.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'

@Auth()
@ApiBearerAuth()
@ApiTags('Leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
	constructor(private readonly leaderboardService: LeaderboardService) {}

	@Get()
	@ApiOperation({ summary: 'Get global leaderboard of top users' })
	@ApiQuery({
		name: 'limit',
		required: false,
		example: 25,
		description: 'Number of top users to return (default: 25)',
	})
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved global leaderboard',
	})
	@ApiResponse({
		status: 404,
		description: 'No users found for leaderboard',
	})
	async getGlobalLeaderboard(@Query('limit') limit?: number) {
		const top = limit ? Number(limit) : 25
		return this.leaderboardService.getLeaderboard(top)
	}

	@Get('family')
	@ApiOperation({ summary: 'Get leaderboard within a specific family' })
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved family leaderboard',
	})
	@ApiResponse({
		status: 404,
		description: 'Family or members not found',
	})
	async getFamilyLeaderboard(@CurrentUser('family_id') familyId: string) {
		return this.leaderboardService.getFamilyLeaderboard(familyId)
	}
}
