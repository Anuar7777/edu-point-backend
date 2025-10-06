import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CodeService } from './code.service'

@Module({
	providers: [CodeService, PrismaService],
	exports: [CodeService],
})
export class CodeModule {}
