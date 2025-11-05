import { Prisma } from '@prisma/client'

export type SectionWithPayload = Prisma.SectionGetPayload<{
	include: { questionTemplates: { include: { instances: true } } }
}>

export type QuestionTemplatesWithPayload =
	SectionWithPayload['questionTemplates'][number]

export interface TestQuestion {
	textEn: string
	textRu: string
	textKz: string
	instanceId: string
	templateId: string
	explanation: string | null
	answerOptions: string[]
	correctAnswer: string
}

export interface TestAnswer {
	instanceId: string
	templateId: string
	userAnswer: string
}
