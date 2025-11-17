import { Injectable, NotFoundException } from '@nestjs/common'
import { FamilyService } from '../family.service'
import { UserApplicationService } from 'src/user/user-application/user-appllication.service'
import { Application } from '@prisma/client'

@Injectable()
export class FamilyApplicationService {
	constructor(
		private readonly familyService: FamilyService,
		private readonly userApplicationService: UserApplicationService,
	) {}

	async getChildApplications(parentFamilyId: string, childId: string) {
		const isChildInFamily = await this.familyService.isUserInFamily(
			parentFamilyId,
			childId,
		)

		if (!isChildInFamily) {
			throw new NotFoundException('Child not found')
		}

		return this.userApplicationService.getByUserId(childId)
	}

	async updateChildApplications(
		parentFamilyId: string,
		childId: string,
		data: Application[],
	) {
		const isChildInFamily = await this.familyService.isUserInFamily(
			parentFamilyId,
			childId,
		)

		if (!isChildInFamily) {
			throw new NotFoundException('Child not found')
		}

		return this.userApplicationService.updateByUserId(childId, data)
	}
}
