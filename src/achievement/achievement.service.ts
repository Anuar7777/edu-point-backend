import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class AchievementService {
	constructor(private readonly prisma: PrismaService) {}

	async getAll() {
		return this.prisma.achievement.findMany()
	}

	async getUserAchievements(userId: string) {
		const achievements = await this.prisma.achievement.findMany({
			include: {
				UserAchievements: {
					where: { userId },
					select: { isAchieved: true },
				},
			},
		})

		return achievements.map(({ UserAchievements, ...achievement }) => {
			const isAchieved = UserAchievements?.[0]?.isAchieved ?? false
			return {
				...achievement,
				isAchieved,
			}
		})
	}

	async grantAchievement(userId: string, achievementId: string) {
		return this.prisma.userAchievement.upsert({
			where: { userId_achievementId: { userId, achievementId } },
			update: { isAchieved: true },
			create: { userId, achievementId, isAchieved: true },
		})
	}

	async checkAndGrant(
		userId: string,
		achievementId: string,
		condition: boolean,
	) {
		if (condition) {
			await this.grantAchievement(userId, achievementId)
		}
	}
}
