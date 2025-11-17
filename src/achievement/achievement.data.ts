export type AchievementSeed = {
	achievementId: string
	achievementIconUrl: string | null
	achievementBody: Record<string, { title: string; description: string }>
}

export const achievementData: AchievementSeed[] = [
	{
		achievementId: 'db3f7cf9-b050-4553-ba19-0fdd8a417496',
		achievementIconUrl: '/public/images/achievements/first_step.svg',
		achievementBody: {
			ru: {
				title: 'Первый шаг',
				description: 'Успешно пройти первый тест',
			},
			en: {
				title: 'First Step',
				description: 'Successfully complete your first test',
			},
			kz: {
				title: 'Бірінші қадам',
				description: 'Бірінші тестті сәтті орындау',
			},
		},
	},
	{
		achievementId: '98a9a510-452b-4b63-aaf7-746eb534d849',
		achievementIconUrl: '/public/images/achievements/three_in_row.svg',
		achievementBody: {
			ru: {
				title: 'Готов к следующему уровню',
				description: 'Пройти три курса',
			},
			en: {
				title: 'Ready for the Next Level',
				description: 'Complete three courses',
			},
			kz: {
				title: 'Келесі деңгейге дайынмын',
				description: 'Үш курсты аяқтау',
			},
		},
	},
	{
		achievementId: '609fbf9d-3378-4003-b453-bc661c28cbec',
		achievementIconUrl: '/public/images/achievements/no_mistakes.svg',
		achievementBody: {
			ru: {
				title: 'Высший балл',
				description: 'Пройти тест без ошибок',
			},
			en: {
				title: 'Perfect Score',
				description: 'Complete a test without mistakes',
			},
			kz: {
				title: 'Мінсіз нәтиже',
				description: 'Тестті қатесіз өту',
			},
		},
	},
	{
		achievementId: 'b885773d-9322-4315-a49f-2e5357370d2f',
		achievementIconUrl: '/public/images/achievements/books.svg',
		achievementBody: {
			ru: {
				title: 'Марафон знаний',
				description: 'Пройти 5 курсов',
			},
			en: {
				title: 'Marathon Knowledge',
				description: 'Complete 5 courses',
			},
			kz: {
				title: 'Білім марафоны',
				description: '5 курсты толық бітіру',
			},
		},
	},
]

export enum Achievement {
	FIRST_STEP = 'db3f7cf9-b050-4553-ba19-0fdd8a417496',
	READY_FOR_NEXT_LEVEL = '98a9a510-452b-4b63-aaf7-746eb534d849',
	PERFECT_SCORE = '609fbf9d-3378-4003-b453-bc661c28cbec',
	MARATHON_KNOWLEDGE = 'b885773d-9322-4315-a49f-2e5357370d2f',
}
