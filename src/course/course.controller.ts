import { Controller, Get, HttpCode, Param } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UserTokenDto } from '../auth/dto/user-token.dto'
import { CourseService } from './course.service'

@ApiTags('Courses')
@ApiBearerAuth()
@Controller('courses')
export class CourseController {
	constructor(private readonly courseService: CourseService) {}

	@Auth()
	@HttpCode(200)
	@Get()
	@ApiOperation({ summary: 'Get all available courses for the current user' })
	@ApiResponse({
		status: 200,
		description: 'List of courses returned successfully',
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized - JWT token missing or invalid',
	})
	async getAll(@CurrentUser() user: UserTokenDto) {
		return this.courseService.getAll(user.id, user.role as Role)
	}

	@Auth()
	@HttpCode(200)
	@Get(':courseId')
	@ApiOperation({ summary: 'Get detailed info about a specific course' })
	@ApiParam({
		name: 'courseId',
		required: true,
		description: 'Unique course identifier (UUID)',
		example: '8a7b1c2d-3e4f-5678-9012-abcdef123456',
	})
	@ApiResponse({
		status: 200,
		description: 'Course found and returned successfully',
	})
	@ApiResponse({ status: 404, description: 'Course not found' })
	@ApiResponse({
		status: 401,
		description: 'Unauthorized - JWT token missing or invalid',
	})
	async getById(
		@Param('courseId') courseId: string,
		@CurrentUser() user: UserTokenDto,
	) {
		return this.courseService.getById(courseId, user.id, user.role as Role)
	}
}
