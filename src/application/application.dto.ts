import { ApiProperty } from '@nestjs/swagger'

export class ApplicationDto {
	@ApiProperty({
		example: 'com.instagram.android',
		description: 'Unique package identifier of the application',
	})
	packageName: string

	@ApiProperty({
		example: 'Instagram',
		description: 'Display name of the application',
	})
	appName: string

	@ApiProperty({
		example: '/icons/instagram.png',
		description: 'Path to the icon of the application',
		required: false,
	})
	iconPath?: string
}
