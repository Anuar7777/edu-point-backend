import { Injectable, NotFoundException } from '@nestjs/common'
import { Application } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class ApplicationService {
	constructor(private readonly prisma: PrismaService) {}

	async getById(packageName: string) {
		const application = await this.prisma.application.findUnique({
			where: { packageName },
		})

		if (!application) {
			throw new NotFoundException('Application not found')
		}

		return application
	}

	async getAll() {
		return this.prisma.application.findMany()
	}

	async createMany(data: Application[]) {
		return this.prisma.application.createManyAndReturn({
			data,
			skipDuplicates: true,
		})
	}
}
