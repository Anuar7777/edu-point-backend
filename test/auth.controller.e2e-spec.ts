import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '../src/auth/auth.controller'
import { AuthService } from '../src/auth/auth.service'
import { UserService } from '../src/user/user.service'
import { PrismaService } from '../src/prisma.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { FamilyService } from '../src/family/family.service'
import { CodeService } from '../src/code/code.service'
import { MailService } from '../src/mail/mail.service'
import { SettingsService } from '../src/settings/settings.service'
import { Response, Request } from 'express'
import { clearDatabase } from './setup'
import { AuthDto, RegisterDto } from '../src/auth/dto/auth.dto'
import { Role } from '@prisma/client'
import * as argon2 from 'argon2'

describe('AuthController (e2e)', () => {
	let controller: AuthController
	let prisma: PrismaService

	beforeAll(async () => {
		prisma = new PrismaService()

		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				JwtModule.register({
					secret: 'test-secret',
					signOptions: { expiresIn: '1h' },
				}),
			],
			controllers: [AuthController],
			providers: [
				AuthService,
				UserService,
				SettingsService,
				{ provide: PrismaService, useValue: prisma },
				{
					provide: FamilyService,
					useValue: {
						getFamilyByUserId: jest.fn().mockResolvedValue(null),
						create: jest
							.fn()
							.mockResolvedValue({ familyId: 'family-1', name: 'Test Family' }),
					},
				},
				{
					provide: CodeService,
					useValue: {
						generate: jest.fn().mockResolvedValue({
							code: '123456',
							codeId: 'code-1',
							user: null,
						}),
						findValid: jest.fn().mockResolvedValue({
							codeId: 'code-1',
							user: {
								userId: 'user-1',
								username: 'Test',
								email: 'test@mail.com',
								role: Role.CHILD,
							},
							code: '123456',
						}),
						use: jest.fn(),
					},
				},
				{
					provide: MailService,
					useValue: { send: jest.fn(), sendInvite: jest.fn() },
				},
			],
		}).compile()

		controller = module.get<AuthController>(AuthController)
	})

	afterAll(async () => {
		await clearDatabase()
		await prisma.$disconnect()
	})

	beforeEach(async () => {
		await clearDatabase()
	})

	it('should register a new user', async () => {
		const dto: RegisterDto = {
			email: 'child@example.com',
			password: 'password123',
			username: 'Child',
			role: Role.CHILD,
		}
		const result = await controller.register(dto)
		expect(result).toHaveProperty('message')
	})

	it('should login verified user with real JwtService', async () => {
		const hashedPassword = await argon2.hash('password123')
		const user = await prisma.user.create({
			data: {
				email: 'child3@example.com',
				username: 'Child3',
				password: hashedPassword,
				role: Role.CHILD,
				isVerified: true,
			},
		})

		const dto: AuthDto = { email: user.email, password: 'password123' }
		const res = { cookie: jest.fn() } as unknown as Response
		const result = await controller.login(dto, res)

		expect(result).toHaveProperty('user')
		expect(result).toHaveProperty('accessToken')
		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(res.cookie).toHaveBeenCalled()
	})

	it('should refresh tokens with real JwtService', async () => {
		const hashedPassword = await argon2.hash('password123')
		const user = await prisma.user.create({
			data: {
				email: 'child4@example.com',
				username: 'Child4',
				password: hashedPassword,
				role: Role.CHILD,
				isVerified: true,
			},
		})

		const authService = controller['authService']
		const tokens = authService['issueTokens']({
			id: user.userId,
			name: user.username,
			email: user.email,
			role: user.role,
			family_id: null,
		})

		const req = {
			cookies: { [authService.REFRESH_TOKEN_NAME]: tokens.refreshToken },
		} as unknown as Request
		const res = { cookie: jest.fn() } as unknown as Response

		const result = await controller.getNewTokens(req, res)
		expect(result).toHaveProperty('user')
		expect(result).toHaveProperty('accessToken')
		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(res.cookie).toHaveBeenCalled()
	})
})
