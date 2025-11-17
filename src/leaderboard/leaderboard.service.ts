import { Injectable, NotFoundException } from '@nestjs/common'
import { FamilyService } from '../family/family.service'
import { UserService } from '../user/user.service'

@Injectable()
export class LeaderboardService {
	constructor(
		private readonly userService: UserService,
		private readonly familyService: FamilyService,
	) {}

	async getLeaderboard(limit: number) {
		const users = await this.userService.getTopUsers(limit)

		if (!users || users.length === 0) {
			throw new NotFoundException('No users found for leaderboard')
		}

		return users.map((user, index) => ({
			rank: index + 1,
			userId: user.userId,
			username: user.username,
			imageUrl: user.imageUrl,
			points: user.points ?? 0,
		}))
	}

	async getFamilyLeaderboard(familyId: string) {
		return this.familyService.getFamilyChilds(familyId)
	}
}
