import { Role } from '@prisma/client'
import { IsEmail, IsEnum, IsString, Length, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	password: string
}

export class RegisterDto extends AuthDto {
	@IsString()
	username: string

	@IsEnum(Role, { message: 'Role must be either parent or child' })
	role: Role
}

export class VerifyCodeDto {
	@IsEmail()
	email: string

	@IsString()
	@Length(4, 10, { message: 'Code must be between 4 and 10 characters long' })
	code: string
}
