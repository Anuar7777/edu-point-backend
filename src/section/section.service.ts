import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { SectionWithPayload } from './section.types'
import { TestService } from '../test/test.service'

@Injectable()
export class SectionService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly testService: TestService,
	) {}

	async get(sectionId: string) {
		const section = await this.prisma.section.findUnique({
			where: { sectionId },
			include: {
				questionTemplates: {
					include: {
						instances: true,
					},
				},
			},
		})

		if (!section) {
			throw new NotFoundException('Section not found')
		}

		return section as SectionWithPayload
	}

	async generate(sectionId: string, userId: string) {
		const section = await this.get(sectionId)

		return this.testService.generate(section, userId)
	}
}
