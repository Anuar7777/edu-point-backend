import { IsArray, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class TestAnswerDto {
	@ApiProperty({
		example: '254d35b6-da2b-4ecd-8eda-fea00655564f',
		description: 'Instance ID of the question',
	})
	@IsString()
	instanceId: string

	@ApiProperty({
		example: 'd9ebd88e-a9c4-4e67-a96f-82af2e26ebc8',
		description: 'Template ID of the question',
	})
	@IsString()
	templateId: string

	@ApiProperty({ example: '6686', description: 'User selected answer' })
	@IsString()
	userAnswer: string
}

export class TestResultsDto {
	@ApiProperty({
		type: [TestAnswerDto],
		description: 'Array of answers submitted by the user',
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TestAnswerDto)
	answers: TestAnswerDto[]
}
