import { Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { seedCourses } from './seed/courses'
import { seedFamily } from './seed/families'
import { seedLocations } from './seed/location'
import { seedUsers } from './seed/users'

const prisma = new PrismaClient()
const logger = new Logger('seed')

async function main() {
	await seedUsers()
	await seedCourses()
	await seedFamily()
	await seedLocations()

	logger.log('All seeders have been executed successfully')
}

main()
	.then(() => prisma.$disconnect())
	.catch(async e => {
		logger.error('An error occurred while running the seeder:', e)
		await prisma.$disconnect()
		process.exit(1)
	})
