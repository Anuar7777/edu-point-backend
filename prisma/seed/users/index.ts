import { Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { hash } from 'argon2'
import { usersData } from './data'

const prisma = new PrismaClient()
const logger = new Logger('seed')

export async function seedUsers() {
	for (const user of usersData) {
		const hashedPassword = await hash(user.password)

		const createdUser = await prisma.user.upsert({
			where: { email: user.email },
			update: {
				username: user.username,
				password: hashedPassword,
				role: user.role,
			},
			create: {
				userId: user.userId,
				username: user.username,
				email: user.email,
				password: hashedPassword,
				role: user.role,
				points: 0,
				isVerified: true,
			},
		})

		logger.log(
			`User "${createdUser.username}" (${user.email}) has been upserted successfully`,
		)
	}

	logger.log('All users have been seeded successfully')
	await prisma.$disconnect()
}
