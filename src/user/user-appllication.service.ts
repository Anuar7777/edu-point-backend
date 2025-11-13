import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ApplicationService } from 'src/application/application.service'
import { Application } from '@prisma/client'

@Injectable()
export class UserApplicationService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly applicationService: ApplicationService,
	) {}

	async getByUserId(userId: string) {
		const applications = await this.prisma.userApplication.findMany({
			where: { userId },
		})

		return applications
	}

	async updateByUserId(userId: string, data: Application[]) {
		const packageNames = data.map(app => app.packageName)

		await this.applicationService.createMany(data)

		await this.prisma.$transaction(async prisma => {
			await prisma.userApplication.deleteMany({
				where: {
					userId,
					application: {
						packageName: {
							notIn: packageNames.length ? packageNames : undefined,
						},
					},
				},
			})

			if (packageNames.length > 0) {
				await prisma.userApplication.createMany({
					data: packageNames.map(packageName => ({
						userId,
						packageName,
					})),
					skipDuplicates: true,
				})
			}
		})
	}
}
