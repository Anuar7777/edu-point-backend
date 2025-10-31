import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class LocationDto {
	@ApiProperty({
		example: 43.238949,
		description: 'Latitude of the user location',
	})
	@IsNumber()
	latitude: number

	@ApiProperty({
		example: 76.889709,
		description: 'Longitude of the user location',
	})
	@IsNumber()
	longitude: number
}
