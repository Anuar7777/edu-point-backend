/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Logger } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { coursesData } from './data'

const prisma = new PrismaClient()
const logger = new Logger('seed')

export async function seedCourses() {
	for (const [key, courseData] of Object.entries(coursesData)) {
		const course = await prisma.course.upsert({
			where: { courseId: courseData.courseId },
			update: {},
			create: {
				courseId: courseData.courseId,
				title: courseData.title,
				description: courseData.description,
				imageUrl: courseData.imageUrl,
				totalSections: courseData.totalSections,
				sections: {
					create: courseData.sections.map(section => ({
						title: section.title,
						description: section.description,
						questionTemplates: {
							create: section.questionTemplates.map(qt => ({
								textEn: qt.text_en,
								textRu: qt.text_ru,
								textKz: qt.text_kz,
								explanation: qt.explanation,
								instances: {
									create: qt.instances.map(inst => ({
										answerOptions: inst.answerOptions,
										correctAnswer: inst.correctAnswer,
										variables:
											inst.variables !== null
												? inst.variables
												: Prisma.JsonNull,
									})),
								},
							})),
						},
					})),
				},
			},
		})

		logger.log(
			`Course "${course.title}" (${key}) has been successfully updated.`,
		)
	}

	logger.log('All courses have been seeded successfully')
	await prisma.$disconnect()
}
