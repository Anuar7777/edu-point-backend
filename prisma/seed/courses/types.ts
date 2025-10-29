// TODO: need to implement proper types for courses

export interface Instance {
	answerOptions: string[]
	correctAnswer: string
	variables: Record<string, number>
}

export interface QuestionTemplate {
	text: string
	explanation: string
	instances: Instance[]
}

export interface Section {
	title: string
	description: string
	questionTemplates: QuestionTemplate[]
}

export interface Course {
	courseId: string
	title: string
	description: string
	imageUrl: string
	totalSections: number
	sections: Section[]
}
