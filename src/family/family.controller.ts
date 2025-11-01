import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { IsParent } from 'src/auth/decorators/roles.decorator'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UserTokenDto } from '../auth/dto/user-token.dto'
import { FamilyDto } from './dto/family.dto'
import { FamilyService } from './family.service'

@ApiTags('Family')
@ApiBearerAuth()
@Auth()
@Controller('family')
export class FamilyController {
	constructor(private readonly familyService: FamilyService) {}

	@HttpCode(200)
	@Get()
	@ApiOperation({ summary: 'Get current user family info' })
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved family data',
	})
	@ApiResponse({ status: 404, description: 'Family not found for this user' })
	async get(@CurrentUser('id') userId: string) {
		return this.familyService.get(userId)
	}

	@HttpCode(200)
	@Put(':id')
	@ApiOperation({ summary: 'Update family info' })
	@ApiResponse({ status: 200, description: 'Family successfully updated' })
	@ApiResponse({
		status: 404,
		description: 'Family not found or access denied',
	})
	@ApiParam({
		name: 'id',
		example: 'b613066f-8269-4f3b-ba7d-9313ecd55f18',
		description: 'The unique ID of the family to update',
	})
	async update(
		@Body() dto: FamilyDto,
		@Param('id') familyId: string,
		@CurrentUser('id') userId: string,
	) {
		return this.familyService.update(dto, familyId, userId)
	}

	@HttpCode(200)
	@Post('invite')
	@ApiOperation({ summary: 'Invite child by email' })
	@ApiResponse({ status: 200, description: 'Invitation sent successfully' })
	@ApiResponse({ status: 403, description: 'Only parents can invite children' })
	@ApiBody({
		schema: {
			example: {
				email: 'child@smartbala.com',
			},
		},
	})
	async inviteChild(
		@CurrentUser() parent: UserTokenDto,
		@Body('email') email: string,
	) {
		return this.familyService.inviteChild(parent, email)
	}

	@IsParent()
	@HttpCode(200)
	@Post('add')
	@ApiOperation({
		summary: 'Add a child to the family using the invitation code.',
		description:
			'Allows a parent to add a child by providing the child’s email and a valid invitation code.',
	})
	@ApiResponse({
		status: 200,
		description: 'Child successfully joined the family',
	})
	@ApiResponse({
		status: 400,
		description: 'Invalid or expired code, or child already has a family',
	})
	@ApiResponse({
		status: 404,
		description: 'Parent family not found or child not found',
	})
	@ApiBody({
		schema: {
			example: {
				email: 'child@smartbala.com',
				code: '123456',
			},
		},
	})
	async add(
		@CurrentUser() parent: UserTokenDto,
		@Body() dto: { email: string; code: string },
	) {
		return this.familyService.add(parent, dto.email, dto.code)
	}

	@HttpCode(200)
	@Delete('remove/:childId')
	@ApiOperation({ summary: 'Remove child from family' })
	@ApiResponse({ status: 200, description: 'Child successfully removed' })
	@ApiResponse({ status: 404, description: 'Access denied or child not found' })
	@ApiParam({
		name: 'childId',
		example: 'd12bec0e-423e-400b-8ba4-9e81c1b382b4',
		description: 'The ID of the child to remove from the family',
	})
	async removeChild(
		@CurrentUser('id') parentId: string,
		@Param('childId') childId: string,
	) {
		return this.familyService.removeChild(parentId, childId)
	}
}
