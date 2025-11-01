import { Body, Controller, Get, HttpCode, Param, Put } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { UpdateAdvancedSettingsDto } from 'src/settings/settings.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { SettingsService } from '../settings/settings.service'
import { FamilyService } from './family.service'

@ApiTags('Family - Settings')
@ApiBearerAuth()
@Auth()
@Controller('family/child')
export class FamilySettingsController {
	constructor(
		private readonly familyService: FamilyService,
		private readonly settingsService: SettingsService,
	) {}
	// TODO: The settings are used in the family. Transfer them
	@HttpCode(200)
	@Get(':childId/settings')
	@ApiOperation({ summary: 'Get child settings (by parent)' })
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved child settings',
	})
	@ApiResponse({ status: 404, description: 'Child not found' })
	@ApiOperation({ summary: 'Get child settings (by parent)' })
	@ApiParam({
		name: 'childId',
		example: 'd12bec0e-423e-400b-8ba4-9e81c1b382b4',
		description: 'The ID of the child whose settings are being retrieved',
	})
	async getChildSettings(
		@CurrentUser('id') parentId: string,
		@Param('childId') childId: string,
	) {
		return this.settingsService.getById(parentId, childId)
	}

	@HttpCode(200)
	@Put(':childId/settings')
	@ApiOperation({ summary: 'Update child settings (by parent)' })
	@ApiResponse({
		status: 200,
		description: 'Child settings successfully updated',
	})
	@ApiResponse({ status: 404, description: 'Child not found or access denied' })
	@ApiParam({
		name: 'childId',
		example: 'd12bec0e-423e-400b-8ba4-9e81c1b382b4',
		description: 'The ID of the child whose settings are being updated',
	})
	async updateChildSettings(
		@CurrentUser('id') parentId: string,
		@Param('childId') childId: string,
		@Body() dto: UpdateAdvancedSettingsDto,
	) {
		return this.settingsService.updateById(parentId, childId, dto)
	}
}
