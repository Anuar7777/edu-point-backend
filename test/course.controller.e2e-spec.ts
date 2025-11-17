import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient, Role } from '@prisma/client'
import { CourseController } from '../src/course/course.controller'
import { CourseService } from '../src/course/course.service'
import { clearDatabase } from './setup'

describe('CourseController (e2e)', () => {
	let courseController: CourseController
	let prisma: PrismaClient

	beforeAll(async () => {
		prisma = new PrismaClient()

		const module: TestingModule = await Test.createTestingModule({
			controllers: [CourseController],
			providers: [
				CourseService,
				{ provide: 'PrismaService', useValue: prisma },
			],
		}).compile()

		courseController = module.get<CourseController>(CourseController)
	})

	afterAll(async () => {
		await clearDatabase()
		await prisma.$disconnect()
	})

	beforeEach(async () => {
		await prisma.test.deleteMany()
		await prisma.section.deleteMany()
		await prisma.userCourse.deleteMany()
		await prisma.course.deleteMany()
		await prisma.user.deleteMany()
	})

	/** Хелперы для создания данных */
	const createUser = async (userId: string, role: Role) => {
		return prisma.user.create({
			data: {
				userId,
				username: role + 'User',
				email: `${userId}@example.com`,
				password: 'password',
				role,
			},
		})
	}

	const createCourse = async (title: string, sections: string[] = []) => {
		return prisma.course.create({
			data: {
				title,
				totalSections: sections.length,
				sections: { create: sections.map(title => ({ title })) },
			},
			include: { sections: true },
		})
	}

	const createUserCourse = async (userId: string, courseId: string) => {
		return prisma.userCourse.create({
			data: { userId, courseId },
		})
	}

	/** Тесты для родителя */
	describe('Parent access', () => {
		it('should return all courses for a parent', async () => {
			await createUser('parent-1', Role.PARENT)
			await createCourse('Math', ['Algebra'])
			await createCourse('Science')

			const userToken = {
				id: 'parent-1',
				role: Role.PARENT,
				email: 'parent-1@example.com',
				name: 'Parent',
				family_id: null,
			}

			const courses = await courseController.getAll(userToken)

			expect(courses).toHaveLength(2)
			expect(courses.map(c => c.title)).toEqual(
				expect.arrayContaining(['Math', 'Science']),
			)

			const mathCourseFound = courses.find(c => c.title === 'Math')
			expect(mathCourseFound).toBeDefined()
			expect(mathCourseFound!.sections).toHaveLength(1)
			expect(mathCourseFound!.sections[0].title).toBe('Algebra')
		})

		it('should get course by id for parent', async () => {
			await createUser('parent-1', Role.PARENT)
			const course = await createCourse('Biology')

			const userToken = {
				id: 'parent-1',
				role: Role.PARENT,
				email: 'parent-1@example.com',
				name: 'Parent',
				family_id: null,
			}

			const result = await courseController.getById(course.courseId, userToken)
			expect(result).not.toBeNull()
			expect(result!.title).toBe('Biology')
		})
	})

	/** Тесты для ребенка */
	describe('Child access', () => {
		it('should return only assigned courses for a child', async () => {
			await createUser('child-1', Role.CHILD)
			const mathCourse = await createCourse('Math', ['Algebra'])
			await createUserCourse('child-1', mathCourse.courseId)

			const userToken = {
				id: 'child-1',
				role: Role.CHILD,
				email: 'child-1@example.com',
				name: 'Child',
				family_id: null,
			}

			const courses = await courseController.getAll(userToken)
			expect(courses).toHaveLength(1)
			expect(courses[0].title).toBe('Math')
			expect(courses[0].sections).toHaveLength(1)
			expect(courses[0].sections[0].title).toBe('Algebra')
		})

		it('should get course by id for child only if assigned', async () => {
			await createUser('child-1', Role.CHILD)
			const mathCourse = await createCourse('Math')
			const scienceCourse = await createCourse('Science')
			await createUserCourse('child-1', mathCourse.courseId)

			const userToken = {
				id: 'child-1',
				role: Role.CHILD,
				email: 'child-1@example.com',
				name: 'Child',
				family_id: null,
			}

			const resultMath = await courseController.getById(
				mathCourse.courseId,
				userToken,
			)
			expect(resultMath).not.toBeNull()
			expect(resultMath!.title).toBe('Math')

			const resultScience = await courseController.getById(
				scienceCourse.courseId,
				userToken,
			)
			expect(resultScience).toBeNull() // Ребенок не имеет доступа
		})
	})
})
