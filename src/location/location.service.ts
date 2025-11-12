import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class LocationService {
	constructor(private readonly prisma: PrismaService) {}

	async createLocation(userId: string, lat: number, lon: number) {
		return this.prisma.location.create({
			data: { userId, latitude: lat, longitude: lon },
		})
	}

	async updateLastLocation(userId: string, lat: number, lon: number) {
		const lastLocation = await this.prisma.location.findFirst({
			where: { userId },
		})

		if (!lastLocation) {
			return await this.createLocation(userId, lat, lon)
		}

		return await this.prisma.location.update({
			where: { locationId: lastLocation.locationId },
			data: { latitude: lat, longitude: lon, updatedAt: new Date() },
		})
	}

	async getFamilyLocationsByUser(userId: string) {
		const familyMember = await this.prisma.familyMember.findFirst({
			where: { userId },
		})
		if (!familyMember)
			throw new NotFoundException('Family not found for this user')

		const members = await this.prisma.familyMember.findMany({
			where: { familyId: familyMember.familyId },
			select: { userId: true },
		})

		const userIds = members.map(m => m.userId)
		return this.prisma.location.findMany({
			where: { userId: { in: userIds } },
			orderBy: { updatedAt: 'desc' },
			include: {
				user: {
					select: {
						userId: true,
						username: true,
						role: true,
						imageUrl: true,
					},
				},
			},
		})
	}
}
