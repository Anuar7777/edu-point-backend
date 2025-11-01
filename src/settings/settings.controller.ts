import { Body, Controller, Get, HttpCode, Put } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UpdateBasicSettingsDto } from './settings.dto'
import { SettingsService } from './settings.service'

@ApiTags('Settings')
@ApiBearerAuth()
@Auth()
@Controller('settings')
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@HttpCode(200)
	@Get()
	@ApiOperation({ summary: 'Get current user settings' })
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved user settings',
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized - JWT token missing or invalid',
	})
	async get(@CurrentUser('id') userId: string) {
		return this.settingsService.get(userId)
	}

	@HttpCode(200)
	@Put()
	@ApiOperation({ summary: 'Update current user settings' })
	@ApiResponse({
		status: 200,
		description: 'User settings successfully updated',
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized - JWT token missing or invalid',
	})
	async update(
		@CurrentUser('id') userId: string,
		@Body() dto: UpdateBasicSettingsDto,
	) {
		return this.settingsService.update(userId, dto)
	}
}
