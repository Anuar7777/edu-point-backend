import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient, Role, Language } from '@prisma/client'
import { SettingsController } from '../src/settings/settings.controller'
import { SettingsService } from '../src/settings/settings.service'
import { PrismaService } from '../src/prisma.service'
import { clearDatabase } from './setup'

describe('SettingsController (e2e)', () => {
	let settingsController: SettingsController
	let prisma: PrismaClient

	beforeAll(async () => {
		prisma = new PrismaClient()

		const module: TestingModule = await Test.createTestingModule({
			controllers: [SettingsController],
			providers: [
				SettingsService,
				{ provide: PrismaService, useValue: prisma },
			],
		}).compile()

		settingsController = module.get<SettingsController>(SettingsController)
	})

	afterAll(async () => {
		await clearDatabase()
		await prisma.$disconnect()
	})

	beforeEach(async () => {
		await prisma.settings.deleteMany()
		await prisma.user.deleteMany()
	})

	// helper
	const createUser = async (id: string) => {
		return prisma.user.create({
			data: {
				userId: id,
				username: 'childUser',
				email: `${id}@mail.com`,
				password: '123',
				role: Role.CHILD,
			},
		})
	}

	const createSettings = (userId: string) => {
		return prisma.settings.create({
			data: {
				userId,
				language: Language.EN,
				theme: 'light',
				hasAnimated: false,
			},
		})
	}

	// ==========================
	//            TESTS
	// ==========================

	it('should get current user settings', async () => {
		const user = await createUser('user-1')
		await createSettings(user.userId)

		const result = await settingsController.get(user.userId)

		expect(result).toBeDefined()
		expect(result.userId).toBe(user.userId)
		expect(result.language).toBe(Language.EN)
		expect(result.theme).toBe('light')
	})

	it('should update user settings', async () => {
		const user = await createUser('user-2')
		await createSettings(user.userId)

		const updateDto = {
			language: Language.RU,
			theme: 'dark',
			hasAnimated: true,
		}

		const updated = await settingsController.update(user.userId, updateDto)

		expect(updated.language).toBe(Language.RU)
		expect(updated.theme).toBe('dark')
		expect(updated.hasAnimated).toBe(true)
	})
})
