import { BadRequestException, Injectable } from '@nestjs/common'
import { CodeType } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class CodeService {
	constructor(private prisma: PrismaService) {}

	async generate(userId: string, type: CodeType) {
		const code = Math.floor(100000 + Math.random() * 900000).toString()
		const expiresAt = new Date()
		expiresAt.setMinutes(expiresAt.getMinutes() + 10)

		return this.prisma.code.create({
			data: {
				userId,
				code,
				type,
				expiresAt,
			},
		})
	}

	async findValid(codeValue: string) {
		const code = await this.prisma.code.findFirst({
			where: {
				code: codeValue,
				isUsed: false,
			},
			include: { user: true },
			orderBy: {
				createdAt: 'desc',
			},
		})

		if (!code || new Date() > code.expiresAt) {
			throw new BadRequestException('Invalid or expired code')
		}

		return code
	}

	async use(codeId: string) {
		return this.prisma.code.update({
			where: { codeId },
			data: { isUsed: true },
		})
	}
}
