import { Module } from '@nestjs/common'
import { AchievementService } from './achievement.service'
import { AchievementController } from './achievement.controller'
import { PrismaService } from '../prisma.service'
import { AchievementCheckService } from './achievement-check.service'
import { TestModule } from 'src/test/test.module'

@Module({
	imports: [TestModule],
	controllers: [AchievementController],
	providers: [AchievementService, AchievementCheckService, PrismaService],
	exports: [AchievementCheckService],
})
export class AchievementModule {}
