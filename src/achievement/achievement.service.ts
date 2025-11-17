import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class AchievementService {
	constructor(private readonly prisma: PrismaService) {}

	async getAll() {
		return this.prisma.achievement.findMany()
	}

	async getUserAchievements(userId: string) {
		return this.prisma.userAchievement.findMany({
			where: { userId },
			include: { achievements: true },
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
