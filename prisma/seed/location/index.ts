import { Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const logger = new Logger('seed:location')

const locationData = [
	{
		locationId: 'a58ddc17-1cff-44b2-ad14-d64efaf661dd',
		userId: '0e23c5ed-9d55-4509-9ac2-27e5a18026fb',
		username: 'Айгүл',
		latitude: 51.14004996140666,
		longitude: 71.46612888734606,
	},
	{
		locationId: 'e67e8d1c-4b51-4951-965e-53b7fc6e396d',
		userId: 'd12bec0e-423e-400b-8ba4-9e81c1b382b4',
		username: 'Ернар',
		latitude: 51.12755465381688,
		longitude: 71.42973667583969,
	},
	{
		locationId: 'f38b0a6a-2b2a-4a3e-bf8c-fd66e2a419c9',
		userId: 'bbca1f7b-825a-44cd-9e0a-2f96975e7ae5',
		username: 'Дана',
		latitude: 51.132079207279624,
		longitude: 71.40458828382383,
	},
	{
		locationId: 'b926f6a8-93df-4a73-8b6c-7f54e1e9af3c',
		userId: '26362ffd-4d6c-4ec2-a48b-3703a130d668',
		username: 'Арсен',
		latitude: 51.15297258343537,
		longitude: 71.44510036792339,
	},
	{
		locationId: '9c33134b-2b7b-495a-b260-bbb0bfb64a42',
		userId: '38753859-146e-4630-b1b8-b8c093590deb',
		username: 'Мадина',
		latitude: 51.158086788473966,
		longitude: 71.45857578515286,
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
