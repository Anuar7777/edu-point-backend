import { Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const logger = new Logger('seed')

const familyData = {
	familyId: 'b613066f-8269-4f3b-ba7d-9313ecd55f18',
	name: 'SmartBala Family',
	members: [
		{
			userId: '0e23c5ed-9d55-4509-9ac2-27e5a18026fb',
			username: 'Parent User',
		},
		{
			userId: 'd12bec0e-423e-400b-8ba4-9e81c1b382b4',
			username: 'Child User',
		},
	],
}

export async function seedFamily() {
	const family = await prisma.family.upsert({
		where: { familyId: familyData.familyId },
		update: { name: familyData.name },
		create: {
			familyId: familyData.familyId,
			name: familyData.name,
		},
	})

	for (const member of familyData.members) {
		await prisma.familyMember.upsert({
			where: {
				familyId_userId: { familyId: family.familyId, userId: member.userId },
			},
			update: {},
			create: {
				familyId: family.familyId,
				userId: member.userId,
			},
		})
		logger.log(`User ${member.username} added to family "${family.name}"`)
	}

	logger.log('Family have been seeded successfully')
	await prisma.$disconnect()
}
