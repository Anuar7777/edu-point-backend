import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtPayload, RequestWithUser } from 'types'

export const CurrentUser = createParamDecorator(
	(data: keyof JwtPayload, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<RequestWithUser>()
		const user = request.user

		return data ? user[data] : user
	},
)
