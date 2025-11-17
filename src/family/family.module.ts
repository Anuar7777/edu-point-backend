import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserService } from '../user/user.service'
import { CodeService } from '../code/code.service'
import { MailService } from '../mail/mail.service'
import { PrismaService } from '../prisma.service'
import { SettingsService } from '../settings/settings.service'
import { FamilyCourseController } from './family-course/family-course.controller'
import { FamilySettingsController } from './family-settings.controller'
import { FamilyController } from './family.controller'
import { FamilyService } from './family.service'
import { FamilyCourseService } from './family-course/family-course.service'
import { UserApplicationService } from 'src/user/user-application/user-appllication.service'
import { ApplicationService } from 'src/application/application.service'

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
		UserApplicationService,
		ApplicationService,
	],
	exports: [FamilyService],
})
export class FamilyModule {}
