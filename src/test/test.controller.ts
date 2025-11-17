import { Body, Controller, Get, HttpCode, Param, Put } from '@nestjs/common'
import { TestService } from './test.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { IsChild } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { TestResultsDto } from './test.dto'
import {
	ApiTags,
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBody,
} from '@nestjs/swagger'

@ApiTags('Test')
@ApiBearerAuth()
@IsChild()
@Auth()
@Controller('test')
export class TestController {
	constructor(private readonly testService: TestService) {}

	@HttpCode(200)
	@Get('history')
	@ApiOperation({ summary: 'Get all completed tests for current user' })
	@ApiResponse({ status: 200, description: 'List of completed tests' })
	async getAll(@CurrentUser('id') userId: string) {
		return this.testService.getAll(userId)
	}

	@HttpCode(200)
	@Get(':testId')
	@ApiOperation({ summary: 'Get test by ID' })
	@ApiParam({
		name: 'testId',
		example: '123e4567-e89b-12d3-a456-426614174000',
		description: 'The ID of the test',
	})
	@ApiResponse({ status: 200, description: 'Successfully retrieved test' })
	@ApiResponse({ status: 404, description: 'Test not found' })
	async get(@Param('testId') testId: string) {
		return this.testService.get(testId)
	}

	@HttpCode(200)
	@Put(':testId/submit')
	@ApiOperation({ summary: 'Submit answers for a test' })
	@ApiParam({
		name: 'testId',
		example: '123e4567-e89b-12d3-a456-426614174000',
		description: 'The ID of the test to submit',
	})
	@ApiBody({
		type: TestResultsDto,
		description: 'Array of answers for the test',
	})
	@ApiResponse({ status: 200, description: 'Test submitted successfully' })
	@ApiResponse({
		status: 400,
		description: 'Test already submitted or invalid data',
	})
	@ApiResponse({ status: 404, description: 'Test not found' })
	async submit(
		@Param('testId') testId: string,
		@CurrentUser('id') userId: string,
		@Body() dto: TestResultsDto,
	) {
		return this.testService.submit(testId, userId, dto.answers)
	}
}
