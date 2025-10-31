import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CodeService } from '../code/code.service'
import { MailService } from '../mail/mail.service'
import { PrismaService } from '../prisma.service'
import { SettingsService } from '../settings/settings.service'
import { FamilyCourseController } from './family-course.controller'
import { FamilySettingsController } from './family-settings.controller'
import { FamilyController } from './family.controller'
import { FamilyService } from './family.service'

@Module({
	imports: [ConfigModule],
	controllers: [
		FamilyController,
		FamilyCourseController,
		FamilySettingsController,
	],
	providers: [
		FamilyService,
		PrismaService,
		CodeService,
		MailService,
		SettingsService,
	],
	exports: [FamilyService],
})
export class FamilyModule {}
