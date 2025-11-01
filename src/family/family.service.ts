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

@Injectable()
export class FamilyService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly codeService: CodeService,
		private readonly mailService: MailService,
		private readonly userService: UserService,
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
		if (role !== Role.PARENT) {
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

	async addCourseToChild(parentId: string, childId: string, courseId: string) {
		const parentMember = await this.prisma.familyMember.findFirst({
			where: { userId: parentId },
			include: { user: true },
		})
		if (!parentMember || parentMember.user.role !== Role.PARENT) {
			throw new ForbiddenException('Access denied: not a parent')
		}

		const childMember = await this.prisma.familyMember.findFirst({
			where: { familyId: parentMember.familyId, userId: childId },
			include: { user: true },
		})
		if (!childMember) {
			throw new NotFoundException('Child not found in your family')
		}

		const course = await this.prisma.course.findUnique({ where: { courseId } })
		if (!course) {
			throw new NotFoundException('Course not found')
		}

		const existing = await this.prisma.userCourse.findUnique({
			where: { userId_courseId: { userId: childId, courseId } },
		})
		if (existing) {
			return { message: 'Course already assigned to child' }
		}

		await this.prisma.userCourse.create({
			data: {
				userId: childId,
				courseId,
			},
		})

		return { message: 'Course successfully assigned to child' }
	}

	async removeCourseFromChild(
		parentId: string,
		childId: string,
		courseId: string,
	) {
		const parentMember = await this.prisma.familyMember.findFirst({
			where: { userId: parentId },
			include: { user: true },
		})
		if (!parentMember || parentMember.user.role !== Role.PARENT) {
			throw new ForbiddenException('Access denied: not a parent')
		}

		const childMember = await this.prisma.familyMember.findFirst({
			where: { familyId: parentMember.familyId, userId: childId },
			include: { user: true },
		})
		if (!childMember) {
			throw new NotFoundException('Child not found in your family')
		}

		const existing = await this.prisma.userCourse.findUnique({
			where: { userId_courseId: { userId: childId, courseId } },
		})
		if (!existing) {
			return { message: 'Course not assigned to child' }
		}

		await this.prisma.userCourse.delete({
			where: { userId_courseId: { userId: childId, courseId } },
		})

		return { message: 'Course successfully removed from child' }
	}
}
