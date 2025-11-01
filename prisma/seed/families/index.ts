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
			username: 'Айгүл',
		},
		{
			userId: 'd12bec0e-423e-400b-8ba4-9e81c1b382b4',
			username: 'Ернар',
		},
		{
			userId: 'bbca1f7b-825a-44cd-9e0a-2f96975e7ae5',
			username: 'Дана',
		},
		{
			userId: '26362ffd-4d6c-4ec2-a48b-3703a130d668',
			username: 'Арсен',
		},
		{
			userId: '38753859-146e-4630-b1b8-b8c093590deb',
			username: 'Мадина',
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
