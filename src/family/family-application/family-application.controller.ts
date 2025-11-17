import { Body, Controller, Get, HttpCode, Param, Put } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { Auth } from '../../auth/decorators/auth.decorator'
import { CurrentUser } from '../../auth/decorators/user.decorator'
import { IsParent } from '../../auth/decorators/roles.decorator'
import { FamilyApplicationService } from './family-application.service'
import { ApplicationDto } from '../../application/application.dto'
import { Application } from '@prisma/client'

@ApiTags('Family - Applications')
@ApiBearerAuth()
@IsParent()
@Auth()
@Controller('family/child')
export class FamilyApplicationController {
	constructor(
		private readonly familyApplicationService: FamilyApplicationService,
	) {}

	@HttpCode(200)
	@Get(':childId/applications')
	@ApiOperation({ summary: 'Get all applications for a child (parent only)' })
	@ApiResponse({
		status: 200,
		description: 'List of child applications successfully retrieved',
	})
	@ApiResponse({
		status: 404,
		description: 'Child not found in this family',
	})
	@ApiParam({
		name: 'childId',
		example: 'd12bec0e-423e-400b-8ba4-9e81c1b382b4',
		description: 'The ID of the child whose applications are being retrieved',
	})
	async getChildApplications(
		@CurrentUser('family_id') familyId: string,
		@Param('childId') childId: string,
	) {
		return this.familyApplicationService.getChildApplications(familyId, childId)
	}

	@HttpCode(200)
	@Put(':childId/applications')
	@ApiOperation({
		summary: 'Update applications for a child (parent only)',
	})
	@ApiResponse({
		status: 200,
		description: 'Applications successfully updated',
	})
	@ApiResponse({
		status: 404,
		description: 'Child not found in this family',
	})
	@ApiParam({
		name: 'childId',
		example: 'd12bec0e-423e-400b-8ba4-9e81c1b382b4',
		description: 'The ID of the child whose applications are being updated',
	})
	@ApiBody({
		type: [ApplicationDto],
		description: 'List of applications to assign to the child',
		examples: {
			example1: {
				summary: 'Update applications',
				value: [
					{
						packageName: 'com.instagram.android',
						appName: 'Instagram',
						iconPath: '/icons/instagram.png',
					},
					{
						packageName: 'com.whatsapp',
						appName: 'WhatsApp Messenger',
						iconPath: '/icons/whatsapp.png',
					},
				],
			},
		},
	})
	async updateChildApplications(
		@CurrentUser('family_id') familyId: string,
		@Param('childId') childId: string,
		@Body() applications: ApplicationDto[],
	) {
		return this.familyApplicationService.updateChildApplications(
			familyId,
			childId,
			applications as Application[],
		)
	}
}
