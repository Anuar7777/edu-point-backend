import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { RequestWithUser } from 'types'
import { UserTokenDto } from '../dto/user-token.dto'

export const CurrentUser = createParamDecorator(
	(data: keyof UserTokenDto, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<RequestWithUser>()
		const user = request.user

		return data ? user[data] : user
	},
)
