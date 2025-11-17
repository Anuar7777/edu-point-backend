import { Logger } from '@nestjs/common'
import { PrismaClient, Prisma } from '@prisma/client'
import { achievementData } from '../../../src/achievement/achievement.data'

const prisma = new PrismaClient()
const logger = new Logger('seed')

export async function seedAchievements() {
	for (const achievement of achievementData) {
		await prisma.achievement.upsert({
			where: {
				achievementId: achievement.achievementId,
			},
			update: {
				achievementIconUrl: achievement.achievementIconUrl,
				achievementBody: achievement.achievementBody as Prisma.InputJsonValue,
			},
			create: {
				achievementId: achievement.achievementId,
				achievementIconUrl: achievement.achievementIconUrl,
				achievementBody: achievement.achievementBody as Prisma.InputJsonValue,
			},
		})
	}

	logger.log('All achievements have been seeded successfully')
	await prisma.$disconnect()
}
