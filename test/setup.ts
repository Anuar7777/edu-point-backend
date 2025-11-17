import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
config({ path: '.env.test.local' })

export const prisma = new PrismaClient()

export async function clearDatabase() {
	await prisma.userAchievement.deleteMany()
	await prisma.achievement.deleteMany()
	await prisma.userApplication.deleteMany()
	await prisma.application.deleteMany()
	await prisma.settings.deleteMany()
	await prisma.location.deleteMany()
	await prisma.test.deleteMany()
	await prisma.questionInstance.deleteMany()
	await prisma.questionTemplate.deleteMany()
	await prisma.section.deleteMany()
	await prisma.courseTag.deleteMany()
	await prisma.tag.deleteMany()
	await prisma.userCourse.deleteMany()
	await prisma.course.deleteMany()
	await prisma.familyMember.deleteMany()
	await prisma.family.deleteMany()
	await prisma.code.deleteMany()
	await prisma.user.deleteMany()
}
