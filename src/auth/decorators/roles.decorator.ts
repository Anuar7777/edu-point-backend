import { UseGuards, applyDecorators } from '@nestjs/common'
import { Role } from '@prisma/client'
import { RolesGuard } from '../guards/roles.guard'

export function IsParent() {
	return applyDecorators(UseGuards(RolesGuard.forRole(Role.PARENT)))
}

export function IsChild() {
	return applyDecorators(UseGuards(RolesGuard.forRole(Role.CHILD)))
}
