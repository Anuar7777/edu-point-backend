import { User } from '@prisma/client'

export class UserTokenDto {
	id: string
	name: string
	email: string
	role: string
	family_id: string | null

	constructor(user: User, familyId: string | null = null) {
		this.id = user.userId
		this.name = user.username
		this.email = user.email
		this.role = user.role
		this.family_id = familyId
	}
}
