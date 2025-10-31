import { Controller, Delete, HttpCode, Param, Post } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { FamilyService } from './family.service'

@ApiTags('Family - Courses')
@ApiBearerAuth()
@Controller('family/child')
export class FamilyCourseController {
	constructor(private readonly familyService: FamilyService) {}

	@Auth()
	@HttpCode(200)
	@Post(':childId/course/:courseId')
	@ApiOperation({ summary: 'Assign course to child' })
	@ApiResponse({
		status: 200,
		description: 'Course successfully assigned to child',
	})
	@ApiResponse({ status: 404, description: 'Course or child not found' })
	@ApiParam({
		name: 'childId',
		example: 'd12bec0e-423e-400b-8ba4-9e81c1b382b4',
		description: 'The ID of the child',
	})
	@ApiParam({
		name: 'courseId',
		example: '8a7b1c2d-3e4f-5678-9012-abcdef123456',
		description: 'The ID of the course to assign',
	})
	async addCourseToChild(
		@CurrentUser('id') parentId: string,
		@Param('childId') childId: string,
		@Param('courseId') courseId: string,
	) {
		return this.familyService.addCourseToChild(parentId, childId, courseId)
	}

	@Auth()
	@HttpCode(200)
	@Delete(':childId/course/:courseId')
	@ApiOperation({ summary: 'Remove course from child' })
	@ApiResponse({
		status: 200,
		description: 'Course successfully removed from child',
	})
	@ApiResponse({ status: 404, description: 'Course not found for this child' })
	@ApiParam({
		name: 'childId',
		example: 'd12bec0e-423e-400b-8ba4-9e81c1b382b4',
		description: 'The ID of the child',
	})
	@ApiParam({
		name: 'courseId',
		example: '8a7b1c2d-3e4f-5678-9012-abcdef123456',
		description: 'The ID of the course to remove',
	})
	async removeCourseFromChild(
		@CurrentUser('id') parentId: string,
		@Param('childId') childId: string,
		@Param('courseId') courseId: string,
	) {
		return this.familyService.removeCourseFromChild(parentId, childId, courseId)
	}
}
