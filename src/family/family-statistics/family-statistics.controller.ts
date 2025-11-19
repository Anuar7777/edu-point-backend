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
import { FamilyStatisticsService } from './family-statistics.service'

@ApiTags('Family - Statistics')
@ApiBearerAuth()
@IsParent()
@Auth()
@Controller('family/child')
export class FamilyStatisticsController {
	constructor(
		private readonly familyStatisticsService: FamilyStatisticsService,
	) {}

	@HttpCode(200)
	@Get(':childId/statistics')
	@ApiOperation({
		summary: 'Get all statistics for a child (parent only)',
	})
	@ApiResponse({
		status: 200,
		description: 'List of child statistics successfully retrieved',
	})
	@ApiResponse({
		status: 404,
		description: 'Child not found in this family',
	})
	@ApiParam({
		name: 'childId',
		example: 'd12bec0e-423e-400b-8ba4-9e81c1b382b4',
		description: 'The ID of the child whose statistics are being retrieved',
	})
	async getChildStatistics(
		@CurrentUser('family_id') familyId: string,
		@Param('childId') childId: string,
	) {
		return this.familyStatisticsService.getChildStatistics(familyId, childId)
	}
}
