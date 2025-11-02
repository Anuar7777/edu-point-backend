import { Logger } from '@nestjs/common'
import { Language, PrismaClient } from '@prisma/client'
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
				imageUrl: user.imageUrl,
			},
			create: {
				userId: user.userId,
				username: user.username,
				email: user.email,
				imageUrl: user.imageUrl,
				password: hashedPassword,
				role: user.role,
				points: 0,
				isVerified: true,
			},
		})

		await prisma.settings.upsert({
			where: { userId: createdUser.userId },
			update: {},
			create: {
				userId: createdUser.userId,
				language: Language.EN,
				theme: 'light',
				isAppAdmin: false,
				dailyLimit: 3,
				sessionTime: 60,
			},
		})

		logger.log(
			`User "${createdUser.username}" (${user.email}) has been upserted successfully`,
		)
	}

	logger.log('All users have been seeded successfully')
	await prisma.$disconnect()
}
