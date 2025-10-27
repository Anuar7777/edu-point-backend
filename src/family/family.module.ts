import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CodeService } from '../code/code.service'
import { MailService } from '../mail/mail.service'
import { PrismaService } from '../prisma.service'
import { FamilyController } from './family.controller'
import { FamilyService } from './family.service'

@Module({
	imports: [ConfigModule],
	controllers: [FamilyController],
	providers: [FamilyService, PrismaService, CodeService, MailService],
	exports: [FamilyService],
})
export class FamilyModule {}
