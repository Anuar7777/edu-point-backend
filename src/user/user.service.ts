import { Injectable, NotFoundException } from '@nestjs/common'
import { User } from '@prisma/client'
import { hash } from 'argon2'
import { RegisterDto } from '../auth/dto/auth.dto'
import { PrismaService } from '../prisma.service'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				userId: id,
			},
		})
	}

	async getByEmail(email: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: { email },
		})
	}

	async getProfile(userId: string) {
		const user = await this.prisma.user.findUnique({
			where: { userId },
			include: {
				UserCourse: {
					include: {
						course: true,
					},
				},
				Settings: true,
			},
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return user
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

	async markVerified(userId: string) {
		return this.prisma.user.update({
			where: { userId },
			data: { isVerified: true },
		})
	}
}
