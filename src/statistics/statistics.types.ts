export interface UserStatistics {
	tests: {
		total: number
		passed: number
		failed: number
		averageScore: number | null
		lastTestDate: Date | null
	}
	courses: {
		totalCourses: number
		coursesInProgress: number
		coursesCompleted: number
		averageProgressPercent: number | null
	}
}
