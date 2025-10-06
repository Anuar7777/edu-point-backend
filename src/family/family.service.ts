import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { CodeType, Role } from '@prisma/client'
import { UserTokenDto } from '../auth/dto/user-token.dto'
import { CodeService } from '../code/code.service'
import { MailService } from '../mail/mail.service'
import { PrismaService } from '../prisma.service'
import { FamilyDto } from './dto/family.dto'

@Injectable()
export class FamilyService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly codeService: CodeService,
		private readonly mailService: MailService,
	) {}

	async get(userId: string) {
		const familyMember = await this.prisma.familyMember.findFirst({
			where: { userId },
			include: {
				family: {
					include: {
						members: {
							include: {
								user: {
									select: {
										userId: true,
										username: true,
										email: true,
										role: true,
									},
								},
							},
						},
					},
				},
			},
		})

		if (!familyMember) {
			throw new NotFoundException('Family not found for this user')
		}

		return familyMember.family
	}

	async create(dto: FamilyDto, userId: string, role: Role) {
		if (role !== Role.parent) {
			throw new ForbiddenException('Only parents can create a family')
		}

		const existingMember = await this.prisma.familyMember.findFirst({
			where: { userId },
			include: {
				family: {
					include: {
						members: {
							include: {
								user: {
									select: {
										userId: true,
										username: true,
										email: true,
										role: true,
									},
								},
							},
						},
					},
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

	async update(dto: FamilyDto, familyId: string, userId: string) {
		const member = await this.prisma.familyMember.findUnique({
			where: {
				familyId_userId: { familyId, userId },
			},
		})

		if (!member) {
			throw new NotFoundException('Family not found or access denied')
		}

		return this.prisma.family.update({
			where: { familyId },
			data: { ...dto },
		})
	}

	async inviteChild(parent: UserTokenDto, childEmail: string) {
		if (parent.role !== Role.parent) {
			throw new ForbiddenException('Only parents can invite children')
		}

		const invite = await this.codeService.generate(parent.id, CodeType.invite)

		await this.mailService.sendInvite(childEmail, invite.code)

		return {
			message: `Invitation sent to ${childEmail}`,
			code: invite.code,
		}
	}

	async join(child: UserTokenDto, codeValue: string) {
		const code = await this.codeService.findValid(codeValue)

		const [parentMember, existingChild] = await Promise.all([
			this.prisma.familyMember.findFirst({
				where: { userId: code.userId },
			}),
			this.prisma.familyMember.findFirst({
				where: { userId: child.id },
			}),
		])

		if (!parentMember) {
			throw new NotFoundException('Parent family not found')
		}
		if (existingChild) {
			throw new ForbiddenException('Child already belongs to a family')
		}

		await this.prisma.familyMember.create({
			data: {
				familyId: parentMember.familyId,
				userId: child.id,
			},
		})

		await this.codeService.use(code.codeId)

		return { message: 'Successfully joined family' }
	}

	async removeChild(parentId: string, childId: string) {
		const parent = await this.prisma.familyMember.findFirst({
			where: { userId: parentId },
			include: { user: true },
		})

		if (!parent || parent.user.role !== 'parent') {
			throw new NotFoundException('Access denied')
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
}
