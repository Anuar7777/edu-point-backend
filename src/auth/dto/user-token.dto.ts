import { User } from '@prisma/client'

export class UserTokenDto {
	id: string
	name: string
	email: string
	daily_limit: number | null
	role: string

	constructor(user: User) {
		this.id = user.userId
		this.name = user.username
		this.email = user.email
		this.role = user.role
		this.daily_limit = user.dailyLimit
	}
}
