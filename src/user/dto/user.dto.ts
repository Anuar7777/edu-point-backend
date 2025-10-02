import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class userDto {
	@IsOptional()
	@IsEmail()
	email?: string

	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	password?: string
}
