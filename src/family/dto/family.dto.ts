import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FamilyDto {
	@ApiProperty({
		example: 'SmartBala Family',
		description: 'The name of the family created by the parent',
	})
	@IsString()
	name: string
}
