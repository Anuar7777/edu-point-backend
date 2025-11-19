import { Controller, Get, HttpCode, Param } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { Auth } from '../../auth/decorators/auth.decorator'
import { CurrentUser } from '../../auth/decorators/user.decorator'
import { IsParent } from '../../auth/decorators/roles.decorator'
import { FamilyAchievementService } from './family-achievement.service'

@ApiTags('Family - Achievements')
@ApiBearerAuth()
@IsParent()
@Auth()
@Controller('family/child')
export class FamilyAchievementController {
	constructor(
		private readonly familyAchievementService: FamilyAchievementService,
	) {}

	@HttpCode(200)
	@Get(':childId/achievements')
	@ApiOperation({
		summary: 'Get all achievements for a child (parent only)',
	})
	@ApiResponse({
		status: 200,
		description: 'List of child achievements successfully retrieved',
	})
	@ApiResponse({
		status: 404,
		description: 'Child not found in this family',
	})
	@ApiParam({
		name: 'childId',
		example: 'd12bec0e-423e-400b-8ba4-9e81c1b382b4',
		description: 'The ID of the child whose achievements are being retrieved',
	})
	async getChildApplications(
		@CurrentUser('family_id') familyId: string,
		@Param('childId') childId: string,
	) {
		return this.familyAchievementService.getChildAchievements(familyId, childId)
	}
}
