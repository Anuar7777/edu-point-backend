import { Injectable, NotFoundException } from '@nestjs/common'
import { FamilyService } from '../family.service'
import { StatisticsService } from '../../statistics/statistics.service'

@Injectable()
export class FamilyStatisticsService {
	constructor(
		private readonly familyService: FamilyService,
		private readonly statisticsService: StatisticsService,
	) {}

	async getChildStatistics(parentFamilyId: string, childId: string) {
		const isChildInFamily = await this.familyService.isUserInFamily(
			parentFamilyId,
			childId,
		)

		if (!isChildInFamily) {
			throw new NotFoundException('Child not found')
		}

		return this.statisticsService.getUserStatistics(childId)
	}
}
