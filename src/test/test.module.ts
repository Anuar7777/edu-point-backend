import { Module } from '@nestjs/common'
import { TestService } from './test.service'
import { TestController } from './test.controller'
import { PrismaService } from '../prisma.service'
import { UserModule } from '../user/user.module'

@Module({
	imports: [UserModule],
	controllers: [TestController],
	providers: [TestService, PrismaService],
	exports: [TestService],
})
export class TestModule {}
