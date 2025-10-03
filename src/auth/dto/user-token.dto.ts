import { User } from '@prisma/client'

export class UserTokenDto {
	id: string
	email: string
	role: string

	constructor(user: User) {
		this.id = user.userId
		this.email = user.email
		this.role = user.role
	}
}
