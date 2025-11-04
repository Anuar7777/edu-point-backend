import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { CodeType, Role } from '@prisma/client'
import { UserService } from 'src/user/user.service'
import { UserTokenDto } from '../auth/dto/user-token.dto'
import { CodeService } from '../code/code.service'
import { MailService } from '../mail/mail.service'
import { PrismaService } from '../prisma.service'
import { FamilyDto } from './dto/family.dto'
import { FamilyWithMembers } from 'types'

@Injectable()
export class FamilyService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly codeService: CodeService,
		private readonly mailService: MailService,
		private readonly userService: UserService,
	) {}
	// TODO: Then rewrite this bad code
	private get familyInclude() {
		return {
			members: {
				include: {
					user: {
						select: {
							userId: true,
							username: true,
							email: true,
							role: true,
							imageUrl: true,
						},
					},
				},
			},
		}
	}

	private formatFamily(family: FamilyWithMembers) {
		return {
			familyId: family.familyId,
			name: family.name,
			members: family.members.map(m => ({
				userId: m.user.userId,
				username: m.user.username,
				email: m.user.email,
				role: m.user.role,
				imageUrl: m.user.imageUrl,
			})),
		}
	}

	async getFamilyById(familyId: string) {
		const family = await this.prisma.family.findUnique({
			where: { familyId },
			include: this.familyInclude,
		})

		if (!family) throw new NotFoundException('Family not found')

		return this.formatFamily(family)
	}

	async getFamilyByUserId(userId: string) {
		const familyMember = await this.prisma.familyMember.findFirst({
			where: { userId },
			include: { family: { include: this.familyInclude } },
		})

		if (!familyMember?.family)
			throw new NotFoundException('Family not found for this user')

		return this.formatFamily(familyMember.family)
	}

	async create(dto: FamilyDto, userId: string) {
		const existingMember = await this.prisma.familyMember.findFirst({
			where: { userId },
			include: {
				family: {
					include: this.familyInclude,
				},
			},
		})

		if (existingMember) {
			return existingMember.family
		}

		return this.prisma.$transaction(async tx => {
			const family = await tx.family.create({
				data: {
					...dto,
				},
			})

			await tx.familyMember.create({
				data: {
					familyId: family.familyId,
					userId: userId,
				},
			})

			return family
		})
	}

	async update(dto: FamilyDto, familyId: string) {
		return this.prisma.family.update({
			where: { familyId },
			data: { ...dto },
		})
	}

	async inviteChild(parent: UserTokenDto, childEmail: string) {
		if (parent.role !== Role.PARENT) {
			throw new ForbiddenException('Only parents can invite children')
		}

		const invite = await this.codeService.generate(parent.id, CodeType.INVITE)

		await this.mailService.sendInvite(childEmail, invite.code)

		return {
			message: `Invitation sent to ${childEmail}`,
		}
	}

	async add(parent: UserTokenDto, childEmail: string, codeValue: string) {
		const code = await this.codeService.findValid(codeValue)

		if (parent.id !== code.userId) {
			throw new BadRequestException('Invalid invitation code: wrong owner')
		}

		const child = await this.userService.getByEmail(childEmail)
		if (!child) {
			throw new NotFoundException('Child not found')
		}

		const existingMember = await this.prisma.familyMember.findFirst({
			where: { userId: child.userId },
		})
		if (existingMember) {
			throw new BadRequestException('Child already belongs to a family')
		}

		const parentMember = await this.prisma.familyMember.findFirst({
			where: { userId: parent.id },
		})
		if (!parentMember) {
			throw new NotFoundException('Parent family not found')
		}

		await this.prisma.familyMember.create({
			data: {
				familyId: parentMember.familyId,
				userId: child.userId,
			},
		})

		await this.codeService.use(code.codeId)

		return {
			message: `Child ${child.username} successfully added to family`,
		}
	}

	async removeChild(parentId: string, childId: string) {
		const parent = await this.prisma.familyMember.findFirst({
			where: { userId: parentId },
			include: { user: true },
		})

		if (!parent || parent.user.role !== Role.PARENT) {
			throw new NotFoundException('Access denied')
		}

		const child = await this.prisma.familyMember.findFirst({
			where: { userId: childId },
			include: { user: true },
		})

		if (!child) {
			throw new NotFoundException('Child not found')
		}

		if (child.familyId !== parent.familyId) {
			throw new BadRequestException('Child does not belong to this family')
		}

		await this.prisma.familyMember.delete({
			where: {
				familyId_userId: {
					familyId: parent.familyId,
					userId: childId,
				},
			},
		})

		return { message: 'Child removed from family' }
	}

	async getChildProfile(familyId: string, childId: string) {
		const isChildInFamily = await this.isUserInFamily(familyId, childId)

		if (!isChildInFamily) {
			throw new NotFoundException('Child not found')
		}
		
		return this.userService.getProfile(childId)
	}

	async isUserInFamily(familyId: string, userId: string) {
		const family = await this.prisma.family.findUnique({
			where: { familyId },
			include: {
				members: true,
			},
		})

		if (!family) {
			throw new NotFoundException('Family not found')
		}

		return family.members.some(member => member.userId === userId)
	}
}
