import { CanActivate, ExecutionContext, Injectable, Type } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '@prisma/client'
import { RequestWithUser } from 'types'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private role: Role,
	) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<RequestWithUser>()
		const user = request.user
		return user?.role === this.role
	}

	static forRole(role: Role): Type<CanActivate> {
		@Injectable()
		class RoleGuard extends RolesGuard {
			constructor(reflector: Reflector) {
				super(reflector, role)
			}
		}
		return RoleGuard
	}
}
