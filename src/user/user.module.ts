import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserCourseService } from './user-course.service'

@Module({
	controllers: [UserController],
	providers: [UserService, UserCourseService, PrismaService],
	exports: [UserService, UserCourseService],
})
export class UserModule {}
