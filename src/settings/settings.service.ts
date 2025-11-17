import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import {
	UpdateAdvancedSettingsDto,
	UpdateBasicSettingsDto,
} from './settings.dto'

@Injectable()
export class SettingsService {
	constructor(private prisma: PrismaService) {}

	async get(userId: string) {
		const settings = await this.prisma.settings.findUnique({
			where: { userId },
		})

		if (!settings) {
			throw new NotFoundException('Settings not found')
		}

		return settings
	}

	async create(userId: string, dto: UpdateBasicSettingsDto) {
		return this.prisma.settings.create({
			data: {
				userId,
				...dto,
			},
		})
	}

	async update(userId: string, dto: UpdateBasicSettingsDto) {
		return this.prisma.settings.update({
			where: { userId },
			data: dto,
			select: {
				theme: true,
				language: true,
				hasAnimated: true,
			},
		})
	}

	async getById(parentId: string, childId: string) {
		const isParent = await this.prisma.familyMember.findFirst({
			where: {
				userId: parentId,
				family: { members: { some: { userId: childId } } },
			},
		})

		if (!isParent) throw new NotFoundException('Child not found')

		const settings = await this.prisma.settings.findUnique({
			where: { userId: childId },
		})

		if (!settings) throw new NotFoundException('Child not found')
		return settings
	}

	async updateById(
		userId: string,
		childId: string,
		dto: UpdateAdvancedSettingsDto,
	) {
		const isParent = await this.prisma.familyMember.findFirst({
			where: { userId, family: { members: { some: { userId: childId } } } },
		})
		if (!isParent) throw new NotFoundException('Child not found')

		return this.prisma.settings.update({
			where: { userId: childId },
			data: dto,
		})
	}
}
