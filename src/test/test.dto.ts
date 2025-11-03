import { IsArray, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class TestAnswerDto {
	@IsString()
	instanceId: string

	@IsString()
	templateId: string

	@IsString()
	userAnswer: string
}

export class TestResultsDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TestAnswerDto)
	answers: TestAnswerDto[]
}
