import { Injectable } from '@nestjs/common'
import { Prisma, PrismaClient, Role } from '@prisma/client'

@Injectable()
export class CourseService {
	private prisma = new PrismaClient()

	async getAll(userId: string, role: Role) {
		if (role === Role.PARENT) {
			return this.prisma.course.findMany({ include: { sections: true } })
		} else if (role === Role.CHILD) {
			const userCourses = await this.prisma.userCourse.findMany({
				where: { userId },
				include: { course: { include: { sections: true } } },
			})
			return userCourses.map(uc => uc.course)
		} else return []
	}

	async getById(courseId: string, userId: string, role: Role) {
		if (role === Role.PARENT) {
			return this.prisma.course.findUnique({
				where: { courseId },
				include: { sections: true },
			})
		} else if (role === Role.CHILD) {
			const userCourse = await this.prisma.userCourse.findUnique({
				where: { userId_courseId: { userId, courseId } },
				include: { course: { include: { sections: true } } },
			})
			if (!userCourse) return null
			return {
				...userCourse.course,
				completedSections: userCourse.completedSections,
				lastAccessed: userCourse.lastAccessed,
			}
		} else return null
	}

	async getRandomQuestions(limit = 5) {
		const templates = await this.prisma.questionTemplate.findMany({
			include: { instances: true },
		})

		if (!templates.length) return []

		const randomQuestions: Array<{
			text: string
			answerOptions: Prisma.JsonValue
			correctAnswer: string
			explanation: string | null
			variables: Prisma.JsonValue | null
		}> = []
		for (let i = 0; i < limit; i++) {
			const template = templates[Math.floor(Math.random() * templates.length)]

			if (!template.instances.length) continue

			const randomInstance =
				template.instances[
					Math.floor(Math.random() * template.instances.length)
				]

			// Подставляем переменные в текст шаблона
			let questionText = template.text
			if (randomInstance.variables) {
				const vars = randomInstance.variables as Record<string, number>
				for (const [key, value] of Object.entries(vars)) {
					questionText = questionText.replace(
						new RegExp(`{${key}}`, 'g'),
						value.toString(),
					)
				}
			}

			randomQuestions.push({
				text: questionText,
				answerOptions: randomInstance.answerOptions,
				correctAnswer: randomInstance.correctAnswer,
				explanation: template.explanation,
				variables: randomInstance.variables,
			})
		}

		return randomQuestions
	}
}
