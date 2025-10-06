import { IsString } from 'class-validator'

export class FamilyDto {
	@IsString()
	name: string
}
