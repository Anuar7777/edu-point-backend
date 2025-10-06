import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UserTokenDto } from '../auth/dto/user-token.dto'
import { FamilyDto } from './dto/family.dto'
import { FamilyService } from './family.service'

@Controller('family')
export class FamilyController {
	constructor(private readonly familyService: FamilyService) {}

	@Auth()
	@HttpCode(200)
	@Get()
	async get(@CurrentUser('id') userId: string) {
		return this.familyService.get(userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async create(
		@Body() dto: FamilyDto,
		@CurrentUser('id') userId: string,
		@CurrentUser('role') role: Role,
	) {
		return this.familyService.create(dto, userId, role)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put(':id')
	async update(
		@Body() dto: FamilyDto,
		@Param('id') familyId: string,
		@CurrentUser('id') userId: string,
	) {
		return this.familyService.update(dto, familyId, userId)
	}

	@Auth()
	@HttpCode(200)
	@Post('invite')
	async inviteChild(
		@CurrentUser() parent: UserTokenDto,
		@Body('email') childEmail: string,
	) {
		return this.familyService.inviteChild(parent, childEmail)
	}

	@Auth()
	@HttpCode(200)
	@Post('join')
	async join(
		@CurrentUser() child: UserTokenDto,
		@Body('code') codeValue: string,
	) {
		return this.familyService.join(child, codeValue)
	}

	@Auth()
	@HttpCode(200)
	@Delete('remove/:id')
	async removeChild(
		@CurrentUser('id') parentId: string,
		@Param('id') childId: string,
	) {
		return this.familyService.removeChild(parentId, childId)
	}
}
