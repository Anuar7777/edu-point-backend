import {
	Body,
	Controller,
	Get,
	HttpCode,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UpdateBasicSettingsDto } from './settings.dto'
import { SettingsService } from './settings.service'

@Controller('settings')
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@Auth()
	@HttpCode(200)
	@Get()
	async get(@CurrentUser('id') userId: string) {
		return this.settingsService.get(userId)
	}

	@Auth()
	@HttpCode(200)
	@Put()
	@UsePipes(new ValidationPipe())
	async update(
		@CurrentUser('id') userId: string,
		@Body() dto: UpdateBasicSettingsDto,
	) {
		return this.settingsService.update(userId, dto)
	}
}
