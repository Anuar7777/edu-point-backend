import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
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
import { UserTokenDto } from '../auth/dto/user-token.dto'
import { SettingsService } from '../settings/settings.service'
import { FamilyDto } from './dto/family.dto'
import { FamilyService } from './family.service'

@ApiTags('Family')
@ApiBearerAuth()
@Controller('family')
export class FamilyController {
	constructor(
		private readonly familyService: FamilyService,
		private readonly settingsService: SettingsService,
	) {}

	@Auth()
	@HttpCode(200)
	@Get()
	@ApiOperation({ summary: 'Get current user family info' })
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved family data',
	})
	@ApiResponse({ status: 404, description: 'Family not found for this user' })
	async get(@CurrentUser('id') userId: string) {
		return this.familyService.get(userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put(':id')
	@ApiOperation({ summary: 'Update family info' })
	@ApiResponse({ status: 200, description: 'Family successfully updated' })
	@ApiResponse({
		status: 404,
		description: 'Family not found or access denied',
	})
	@ApiParam({
		name: 'id',
		example: 'b613066f-8269-4f3b-ba7d-9313ecd55f18',
		description: 'The unique ID of the family to update',
	})
	async update(
		@Body() dto: FamilyDto,
		@Param('id') familyId: string,
		@CurrentUser('id') userId: string,
	) {
		return this.familyService.update(dto, familyId, userId)
	}

	@Auth()
	@HttpCode(200)
	@Post('invite')
	@ApiOperation({ summary: 'Invite child by email' })
	@ApiResponse({ status: 200, description: 'Invitation sent successfully' })
	@ApiResponse({ status: 403, description: 'Only parents can invite children' })
	async inviteChild(
		@CurrentUser() parent: UserTokenDto,
		@Body('email') childEmail: string,
	) {
		return this.familyService.inviteChild(parent, childEmail)
	}

	@Auth()
	@HttpCode(200)
	@Post('join')
	@ApiOperation({ summary: 'Join family by invitation code' })
	@ApiResponse({
		status: 200,
		description: 'Child successfully joined the family',
	})
	@ApiResponse({ status: 404, description: 'Parent family not found' })
	async join(
		@CurrentUser() child: UserTokenDto,
		@Body('code') codeValue: string,
	) {
		return this.familyService.join(child, codeValue)
	}

	@Auth()
	@HttpCode(200)
	@Delete('remove/:childId')
	@ApiOperation({ summary: 'Remove child from family' })
	@ApiResponse({ status: 200, description: 'Child successfully removed' })
	@ApiResponse({ status: 404, description: 'Access denied or child not found' })
	@ApiParam({
		name: 'childId',
		example: 'd12bec0e-423e-400b-8ba4-9e81c1b382b4',
		description: 'The ID of the child to remove from the family',
	})
	async removeChild(
		@CurrentUser('id') parentId: string,
		@Param('childId') childId: string,
	) {
		return this.familyService.removeChild(parentId, childId)
	}

	@ApiTags('Family - Settings')
	@Auth()
	@HttpCode(200)
	@Get('child/:childId/settings')
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

	@ApiTags('Family - Settings')
	@UsePipes(new ValidationPipe())
	@Auth()
	@HttpCode(200)
	@Put('child/:childId/settings')
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
