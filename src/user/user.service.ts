import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { hash } from 'argon2'
import { RegisterDto } from '../auth/dto/auth.dto'
import { PrismaService } from '../prisma.service'

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
				dailyLimit: 3600,
			},
		})
		return user
	}

	async markVerified(userId: string) {
		return this.prisma.user.update({
			where: { userId },
			data: { isVerified: true },
		})
	}
}
