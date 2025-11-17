import { Controller, Get, Param } from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { SectionService } from './section.service'
import { IsChild } from '../auth/decorators/roles.decorator'
import {
	ApiTags,
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse,
} from '@nestjs/swagger'

@ApiTags('Section')
@ApiBearerAuth()
@Auth()
@Controller('section')
export class SectionController {
	constructor(private readonly sectionService: SectionService) {}

	@IsChild()
	@Get(':sectionId')
	@ApiOperation({ summary: 'Generate test for a section' })
	@ApiParam({
		name: 'sectionId',
		example: '6c64395d-665b-4763-a4d0-6c9296a0d695',
		description: 'The ID of the section',
	})
	@ApiResponse({
		status: 200,
		description: 'Successfully generated section test',
	})
	@ApiResponse({ status: 404, description: 'Section not found' })
	async get(
		@Param('sectionId') sectionId: string,
		@CurrentUser('id') userId: string,
	) {
		return this.sectionService.generate(sectionId, userId)
	}
}
