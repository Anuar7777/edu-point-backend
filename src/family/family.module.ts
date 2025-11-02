import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserService } from 'src/user/user.service'
import { CodeService } from '../code/code.service'
import { MailService } from '../mail/mail.service'
import { PrismaService } from '../prisma.service'
import { SettingsService } from '../settings/settings.service'
import { FamilyCourseController } from './family-course.controller'
import { FamilySettingsController } from './family-settings.controller'
import { FamilyController } from './family.controller'
import { FamilyService } from './family.service'
import { FamilyCourseService } from './family-course.service'

@Module({
	imports: [ConfigModule],
	controllers: [
		FamilyController,
		FamilyCourseController,
		FamilySettingsController,
	],
	providers: [
		FamilyService,
		FamilyCourseService,
		PrismaService,
		CodeService,
		MailService,
		SettingsService,
		UserService,
	],
	exports: [FamilyService],
})
export class FamilyModule {}
