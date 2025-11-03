import { Module } from '@nestjs/common'
import { SectionService } from './section.service'
import { SectionController } from './section.controller'
import { TestModule } from '../test/test.module'
import { PrismaService } from 'src/prisma.service'

@Module({
	imports: [TestModule],
	controllers: [SectionController],
	providers: [SectionService, PrismaService],
	exports: [SectionService],
})
export class SectionModule {}
