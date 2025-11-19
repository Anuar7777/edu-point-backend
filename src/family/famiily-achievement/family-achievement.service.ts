import { Injectable, NotFoundException } from '@nestjs/common'
import { FamilyService } from '../family.service'
import { AchievementService } from '../../achievement/achievement.service'

@Injectable()
export class FamilyAchievementService {
	constructor(
		private readonly familyService: FamilyService,
		private readonly achievementService: AchievementService,
	) {}

	async getChildAchievements(parentFamilyId: string, childId: string) {
		const isChildInFamily = await this.familyService.isUserInFamily(
			parentFamilyId,
			childId,
		)

		if (!isChildInFamily) {
			throw new NotFoundException('Child not found')
		}

		return this.achievementService.getUserAchievements(childId)
	}
}
