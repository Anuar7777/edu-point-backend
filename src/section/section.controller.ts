import { Controller, Get, Param } from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { SectionService } from './section.service'

@Auth()
@Controller('section')
export class SectionController {
	constructor(private readonly sectionService: SectionService) {}

	@Get(':sectionId')
	async get(
		@Param('sectionId') sectionId: string,
		@CurrentUser('id') userId: string,
	) {
		return this.sectionService.generate(sectionId, userId)
	}
}
