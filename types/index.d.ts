import { Prisma } from '@prisma/client'
import { UserTokenDto } from 'src/auth/dto/user-token.dto'

export type FamilyWithMembers = Prisma.FamilyGetPayload<{
	include: {
		members: {
			include: {
				user: {
					select: {
						userId: true
						username: true
						email: true
						role: true
						imageUrl: true
						points: true
					}
				}
			}
		}
	}
}>

export type RequestWithUser = Request & {
	user: UserTokenDto
}
