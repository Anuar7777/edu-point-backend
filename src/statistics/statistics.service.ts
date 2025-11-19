import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UserStatistics } from './statistics.types'

@Injectable()
export class StatisticsService {
	constructor(private readonly prisma: PrismaService) {}

	async getUserStatistics(userId: string): Promise<UserStatistics> {
		const tests = await this.prisma.test.findMany({
			where: { userId },
			select: { score: true, status: true, updatedAt: true },
		})

		const passed = tests.filter(t => t.status === 'PASSED').length
		const failed = tests.filter(t => t.status === 'FAILED').length
		const pending = tests.filter(t => t.status === 'PENDING').length
		const totalTests = tests.length - pending
		const averageScore =
			tests.length > 0
				? tests.reduce((sum, t) => sum + (t.score ?? 0), 0) / tests.length
				: null
		const lastTestDate =
			tests.length > 0 ? tests[tests.length - 1].updatedAt : null

		const courses = await this.prisma.userCourse.findMany({
			where: { userId },
			include: { course: true },
		})

		const totalCourses = courses.length
		const coursesCompleted = courses.filter(
			c => c.completedSections === c.course.totalSections,
		).length
		const coursesInProgress = totalCourses - coursesCompleted

		const averageProgressPercent =
			totalCourses > 0
				? courses.reduce(
						(sum, c) =>
							sum +
							((c.completedSections ?? 0) / (c.course.totalSections ?? 1)) *
								100,
						0,
					) / totalCourses
				: null

		return {
			tests: {
				total: totalTests,
				passed,
				failed,
				averageScore,
				lastTestDate,
			},
			courses: {
				totalCourses,
				coursesInProgress,
				coursesCompleted,
				averageProgressPercent,
			},
		}
	}
}
