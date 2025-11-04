import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UserCourse } from '@prisma/client'

@Injectable()
export class UserCourseService {
	constructor(private prisma: PrismaService) {}

	async get(userId: string, courseId: string) {
		const userCourse = await this.prisma.userCourse.findUnique({
			where: { userId_courseId: { userId, courseId } },
		})

		if (!userCourse) {
			throw new NotFoundException('Course not found')
		}

		return userCourse
	}

	async getAll(userId: string) {
		const userCourses = await this.prisma.userCourse.findMany({
			where: { userId },
		})

		if (!userCourses) {
			throw new NotFoundException('Courses not found for this user')
		}

		return userCourses
	}

	async update(userId: string, courseId: string, dto: Partial<UserCourse>) {
		return this.prisma.userCourse.update({
			where: { userId_courseId: { userId, courseId } },
			data: dto,
		})
	}

	async updateProgress(userId: string, courseId: string) {
		return this.prisma.userCourse.update({
			where: { userId_courseId: { userId, courseId } },
			data: {
				completedSections: { increment: 1 },
			},
		})
	}
}
