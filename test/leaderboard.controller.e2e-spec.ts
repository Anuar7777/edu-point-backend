import { Test, TestingModule } from '@nestjs/testing'
import { LeaderboardController } from '../src/leaderboard/leaderboard.controller'
import { LeaderboardService } from '../src/leaderboard/leaderboard.service'
import { UserService } from '../src/user/user.service'
import { FamilyService } from '../src/family/family.service'
import { PrismaClient, Role } from '@prisma/client'
import { clearDatabase } from './setup'
import { PrismaService } from '../src/prisma.service'

describe('LeaderboardController (e2e)', () => {
	let controller: LeaderboardController
	let prisma: PrismaClient

	beforeAll(async () => {
		prisma = new PrismaClient()

		const module: TestingModule = await Test.createTestingModule({
			controllers: [LeaderboardController],
			providers: [
				LeaderboardService,
				UserService,
				{
					provide: FamilyService,
					useValue: {
						getFamilyChilds: jest.fn((familyId: string) =>
							prisma.familyMember
								.findMany({
									where: { familyId },
									include: { user: true },
								})
								.then(members =>
									members.filter(m => m.user.role === 'CHILD').map(m => m.user),
								),
						),
					},
				},
				{ provide: PrismaService, useValue: prisma },
			],
		}).compile()

		controller = module.get<LeaderboardController>(LeaderboardController)
	})

	afterAll(async () => {
		await clearDatabase()
		await prisma.$disconnect()
	})

	beforeEach(async () => {
		await clearDatabase()
	})

	// ========================
	// Хелперы
	// ========================
	const createUser = async (username: string, role: Role, points?: number) =>
		prisma.user.create({
			data: {
				username,
				email: `${username}@mail.com`,
				password: 'pass',
				role,
				points,
			},
		})

	const createFamily = async (name: string) =>
		prisma.family.create({ data: { name } })

	const addMember = async (familyId: string, userId: string) =>
		prisma.familyMember.create({ data: { familyId, userId } })

	// ========================
	// Тесты
	// ========================
	it('should return global leaderboard', async () => {
		await createUser('Alice', Role.CHILD, 120)
		await createUser('Bob', Role.CHILD, 80)
		await createUser('Charlie', Role.CHILD, 100)

		const leaderboard = await controller.getGlobalLeaderboard(3)
		expect(leaderboard).toHaveLength(3)
		expect(leaderboard[0].username).toBe('Alice')
		expect(leaderboard[0].rank).toBe(1)
		expect(leaderboard[1].username).toBe('Charlie')
		expect(leaderboard[1].rank).toBe(2)
		expect(leaderboard[2].username).toBe('Bob')
		expect(leaderboard[2].rank).toBe(3)
	})

	it('should return family leaderboard', async () => {
		const parent = await createUser('Parent', Role.PARENT)
		const child1 = await createUser('Child1', Role.CHILD, 50)
		const child2 = await createUser('Child2', Role.CHILD, 40)
		await createUser('Child3', Role.CHILD, 60)

		const family = await createFamily('Test Family')
		await addMember(family.familyId, parent.userId)
		await addMember(family.familyId, child1.userId)
		await addMember(family.familyId, child2.userId)

		const leaderboard = await controller.getFamilyLeaderboard(family.familyId)

		expect(leaderboard).toHaveLength(2)
		expect(leaderboard.map(u => u.username)).toEqual(
			expect.arrayContaining(['Child1', 'Child2']),
		)
		expect(leaderboard.map(u => u.username)).not.toContain('Parent')
	})
})
