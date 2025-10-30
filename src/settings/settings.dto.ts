import { ApiPropertyOptional } from '@nestjs/swagger'
import { Language } from '@prisma/client'
import {
	IsBoolean,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	Min,
} from 'class-validator'

export class UpdateBasicSettingsDto {
	@ApiPropertyOptional({
		enum: Language,
		example: 'EN',
		description: 'Interface language',
	})
	@IsOptional()
	@IsEnum(Language)
	language?: Language

	@ApiPropertyOptional({
		example: 'dark',
		description: 'Interface theme',
	})
	@IsOptional()
	@IsString()
	theme?: string
}

export class UpdateAdvancedSettingsDto {
	@ApiPropertyOptional({
		example: false,
		description: 'Grant app admin permissions',
	})
	@IsOptional()
	@IsBoolean()
	isAppAdmin?: boolean

	@ApiPropertyOptional({
		example: 3,
		description: 'Daily limit for the child (minimum 1)',
	})
	@IsOptional()
	@IsInt()
	@Min(1)
	dailyLimit?: number

	@ApiPropertyOptional({
		example: 60,
		description: 'Session time in minutes (minimum 1)',
	})
	@IsOptional()
	@IsInt()
	@Min(1)
	sessionTime?: number
}
