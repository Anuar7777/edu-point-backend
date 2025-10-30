import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { SettingsController } from './settings.controller'
import { SettingsService } from './settings.service'

@Module({
	controllers: [SettingsController],
	providers: [SettingsService, PrismaService],
	exports: [SettingsService],
})
export class SettingsModule {}
