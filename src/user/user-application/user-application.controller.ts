import { Body, Controller, Get, HttpCode, Put } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { Auth } from '../../auth/decorators/auth.decorator'
import { CurrentUser } from '../../auth/decorators/user.decorator'
import { UserTokenDto } from '../../auth/dto/user-token.dto'
import { UserApplicationService } from './user-appllication.service'
import { ApplicationDto } from '../../application/application.dto'
import { Application } from '@prisma/client'

@ApiTags('User - Applications')
@ApiBearerAuth()
@Auth()
@Controller('user/applications')
export class UserApplicationController {
	constructor(
		private readonly userApplicationService: UserApplicationService,
	) {}

	@HttpCode(200)
	@Get()
	@ApiOperation({
		summary: 'Get all applications for the current user',
	})
	@ApiResponse({
		status: 200,
		description: 'List of user applications returned successfully',
	})
	async getAll(@CurrentUser() user: UserTokenDto) {
		return this.userApplicationService.getByUserId(user.id)
	}

	@HttpCode(200)
	@Put()
	@ApiOperation({
		summary: 'Update applications for the current user',
	})
	@ApiResponse({
		status: 200,
		description: 'Applications successfully updated',
	})
	@ApiBody({
		type: [ApplicationDto],
		description: 'List of applications to assign to the current user',
		examples: {
			example1: {
				summary: 'Update user applications',
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
	async update(
		@CurrentUser() user: UserTokenDto,
		@Body() applications: ApplicationDto[],
	) {
		return this.userApplicationService.updateByUserId(
			user.id,
			applications as Application[],
		)
	}
}
