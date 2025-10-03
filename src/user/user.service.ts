import { Injectable } from '@nestjs/common'
import { CodeType, User } from '@prisma/client'
import { hash } from 'argon2'
import { RegisterDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				userId: id,
			},
		})
	}

	getByEmail(email: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: { email },
		})
	}

	async create(dto: RegisterDto) {
		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				username: dto.username,
				password: await hash(dto.password),
				role: dto.role,
			},
		})
		return user
	}

	async saveVerificationCode(userId: string, code: string) {
		const expiresAt = new Date()
		expiresAt.setMinutes(expiresAt.getMinutes() + 15)

		return this.prisma.verificationCode.create({
			data: {
				userId,
				code,
				type: CodeType.email,
				expiresAt,
			},
		})
	}

	async getVerificationCode(email: string, code: string) {
		return this.prisma.verificationCode.findFirst({
			where: {
				code,
				user: { email },
			},
			include: { user: true },
		})
	}

	async markUserVerified(userId: string) {
		return this.prisma.user.update({
			where: { userId },
			data: { isVerified: true },
		})
	}

	async markCodeUsed(codeId: string) {
		return this.prisma.verificationCode.update({
			where: { codeId },
			data: { isUsed: true },
		})
	}
}
