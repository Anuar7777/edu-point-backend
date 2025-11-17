import { Test } from '@nestjs/testing'
import { LocationController } from '../src/location/location.controller'
import { LocationService } from '../src/location/location.service'
import { PrismaService } from '../src/prisma.service'
import { Role } from '@prisma/client'
import { UserTokenDto } from 'src/auth/dto/user-token.dto'
import { clearDatabase } from './setup'

describe('LocationController', () => {
	let prisma: PrismaService
	let controller: LocationController

	// ⚙️ Вспомогательные функции
	async function createUser(username: string, role: Role) {
		return await prisma.user.create({
			data: {
				username,
				email: `${username}@mail.com`,
				password: 'pass',
				role,
			},
		})
	}

	async function createFamily(name: string) {
		return await prisma.family.create({
			data: { name },
		})
	}

	async function addMember(familyId: string, userId: string) {
		return await prisma.familyMember.create({
			data: { familyId, userId },
		})
	}

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			controllers: [LocationController],
			providers: [LocationService, PrismaService],
		}).compile()

		prisma = module.get(PrismaService)
		controller = module.get(LocationController)
	})

	afterEach(async () => {
		await clearDatabase()
	})

	afterAll(async () => {
		await prisma.$disconnect()
	})

	// ======================================
	//             TEST #1
	// ======================================
	it('should update user location', async () => {
		const parent = await createUser('parent', Role.PARENT)

		const family = await createFamily('Test Family')
		await addMember(family.familyId, parent.userId)

		const userToken: UserTokenDto = {
			id: parent.userId,
			name: parent.username,
			email: parent.email,
			role: parent.role,
			family_id: family.familyId,
		}

		const result = await controller.update(userToken, {
			latitude: 51.1,
			longitude: 71.4,
		})

		expect(result).toBeDefined()
		expect(result.userId).toBe(parent.userId)
		expect(result.latitude).toBe(51.1)
		expect(result.longitude).toBe(71.4)
	})

	// ======================================
	//             TEST #2
	// ======================================
	it('should return family locations for parent', async () => {
		const parent = await createUser('parent', Role.PARENT)
		const child1 = await createUser('child1', Role.CHILD)
		const child2 = await createUser('child2', Role.CHILD)

		const family = await createFamily('Test Family')
		await addMember(family.familyId, parent.userId)
		await addMember(family.familyId, child1.userId)
		await addMember(family.familyId, child2.userId)

		// создаём локации
		await prisma.location.create({
			data: { userId: child1.userId, latitude: 10, longitude: 10 },
		})

		await prisma.location.create({
			data: { userId: child2.userId, latitude: 20, longitude: 20 },
		})

		await prisma.location.create({
			data: { userId: parent.userId, latitude: 30, longitude: 30 },
		})

		const result = await controller.get(parent.userId)

		expect(result).toHaveLength(3)
		expect(result[0].user.userId).toBe(parent.userId) // самый свежий
		expect(result[1].user.userId).toBe(child2.userId)
		expect(result[2].user.userId).toBe(child1.userId)
	})
})
