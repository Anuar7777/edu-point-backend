import { Controller, Get, HttpCode, Param } from '@nestjs/common'
import { Role } from '@prisma/client'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UserTokenDto } from '../auth/dto/user-token.dto'
import { CourseService } from './course.service'

@Controller('courses')
export class CourseController {
	constructor(private readonly courseService: CourseService) {}

	@Auth()
	@HttpCode(200)
	@Get()
	async getAll(@CurrentUser() user: UserTokenDto) {
		return this.courseService.getAll(user.id, user.role as Role)
	}

	@Auth()
	@HttpCode(200)
	@Get(':courseId')
	async getById(
		@Param('courseId') courseId: string,
		@CurrentUser() user: UserTokenDto,
	) {
		return this.courseService.getById(courseId, user.id, user.role as Role)
	}
}
