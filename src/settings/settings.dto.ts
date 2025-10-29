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
	@IsOptional()
	@IsEnum(Language)
	language?: Language

	@IsOptional()
	@IsString()
	theme?: string
}

export class UpdateAdvancedSettingsDto {
	@IsOptional()
	@IsBoolean()
	isAppAdmin?: boolean

	@IsOptional()
	@IsInt()
	@Min(1)
	dailyLimit?: number

	@IsOptional()
	@IsInt()
	@Min(1)
	sessionTime?: number
}
