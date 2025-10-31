import { Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const logger = new Logger('seed:location')

const ASTANA_COORDS = {
	latitude: 51.1694,
	longitude: 71.4491,
}

const locationData = [
	{
		locationId: 'a58ddc17-1cff-44b2-ad14-d64efaf661dd',
		userId: '0e23c5ed-9d55-4509-9ac2-27e5a18026fb',
		username: 'Parent User',
		...ASTANA_COORDS,
	},
	{
		locationId: 'e67e8d1c-4b51-4951-965e-53b7fc6e396d',
		userId: 'd12bec0e-423e-400b-8ba4-9e81c1b382b4',
		username: 'Child User',
		...ASTANA_COORDS,
	},
]

export async function seedLocations() {
	for (const loc of locationData) {
		await prisma.location.upsert({
			where: { locationId: loc.locationId },
			update: {
				latitude: loc.latitude,
				longitude: loc.longitude,
				updatedAt: new Date(),
			},
			create: {
				locationId: loc.locationId,
				userId: loc.userId,
				latitude: loc.latitude,
				longitude: loc.longitude,
			},
		})

		logger.log(`Location for user ${loc.username} seeded at Astana, Kazakhstan`)
	}

	logger.log('All locations have been seeded successfully')
	await prisma.$disconnect()
}
