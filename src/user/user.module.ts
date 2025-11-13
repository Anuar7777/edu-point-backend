import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserCourseService } from './user-course.service'
import { ApplicationService } from 'src/application/application.service'
import { UserApplicationService } from './user-appllication.service'

@Module({
	controllers: [UserController],
	providers: [
		UserService,
		UserCourseService,
		UserApplicationService,
		PrismaService,
		ApplicationService,
	],
	exports: [UserService, UserCourseService],
})
export class UserModule {}
