import { Body, Controller, Get, HttpCode, Param, Put } from '@nestjs/common'
import { TestService } from './test.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IsChild } from 'src/auth/decorators/roles.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { TestResultsDto } from './test.dto'

@IsChild()
@Auth()
@Controller('test')
export class TestController {
	constructor(private readonly testService: TestService) {}

	@HttpCode(200)
	@Get('history')
	async getAll(@CurrentUser('id') userId: string) {
		return this.testService.getAll(userId)
	}

	@HttpCode(200)
	@Get(':testId')
	async get(@Param('testId') testId: string) {
		return this.testService.get(testId)
	}

	@HttpCode(200)
	@Put(':testId/submit')
	async submit(
		@Param('testId') testId: string,
		@CurrentUser('id') userId: string,
		@Body() dto: TestResultsDto,
	) {
		return this.testService.submit(testId, userId, dto.answers)
	}
}
