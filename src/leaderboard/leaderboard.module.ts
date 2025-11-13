import { Module } from '@nestjs/common'
import { LeaderboardService } from './leaderboard.service'
import { LeaderboardController } from './leaderboard.controller'
import { UserModule } from '../user/user.module'
import { FamilyModule } from '../family/family.module'

@Module({
	imports: [UserModule, FamilyModule],
	controllers: [LeaderboardController],
	providers: [LeaderboardService],
})
export class LeaderboardModule {}
